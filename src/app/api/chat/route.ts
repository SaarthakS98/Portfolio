import { NextRequest } from 'next/server';
import { getGeminiModel } from '@/lib/gemini';
import { getSupabaseAnon } from '@/lib/supabase';
import { SYSTEM } from '@/lib/prompt';

export const runtime = 'nodejs';

type DbMatch = {
  chunk_id: string; doc_id: string; ord: number; heading: string | null;
  text: string; distance: number; fts_rank: number; hybrid_score: number;
};
type MatchWithTitle = DbMatch & { title: string | null };
type Role = 'user' | 'assistant';
type ChatMessage = { role: Role; content: string };
type ChatRequestBody = { messages: ChatMessage[] };

function formatContext(rows: MatchWithTitle[]) {
  const top = rows.slice(0, 6);
  const ctx = top.map(r => `[#${r.ord}] (${r.title ?? 'Untitled'} §${r.heading ?? ''})\n${r.text}`)
                 .join('\n\n---\n\n');
  return { ctx };
}

export async function POST(req: NextRequest) {
  const { messages } = (await req.json()) as ChatRequestBody;
  const userMsg = messages?.at(-1)?.content ?? '';
  if (!userMsg) return new Response('Bad request', { status: 400 });

  const supabase = getSupabaseAnon();

  // We already store embeddings in DB; for retrieval we use the RPC (hybrid)
  const { data: matches, error } = await supabase.rpc('match_chunks', {
    // pass a dummy embedding here only if your RPC requires it—ours builds from query text + stored embeddings.
    // If your RPC expects a vector for similarity, embed the query with Gemini and pass it:
    // query_embedding: await embedText(userMsg),
    query_embedding: null,           // <-- If your SQL function requires it, switch to embedText(userMsg)
    query_text: userMsg,
    match_count: 10,
  });
  if (error) return new Response(error.message, { status: 500 });

  const rows: DbMatch[] = (matches ?? []) as DbMatch[];

  const withTitles: MatchWithTitle[] = await Promise.all(
    rows.map(async (m) => {
      const { data } = await supabase.from('documents').select('title').eq('id', m.doc_id).single();
      return { ...m, title: data?.title ?? null };
    })
  );

  const { ctx } = formatContext(withTitles);

  // Gemini generation
  const model = getGeminiModel('gemini-1.5-flash', SYSTEM); // fast + cheap; switch to 1.5-pro for max quality
  const prompt = `Context:\n${ctx}\n\nQuestion: ${userMsg}\n\nAnswer with citations.`;
  const result = await model.generateContent(prompt);
  const answer = result.response.text();

  return Response.json({ answer, references: withTitles.slice(0, 6) });
}
