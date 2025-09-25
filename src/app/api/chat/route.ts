import { NextRequest } from 'next/server';
import { getGeminiModel, embedText } from '@/lib/gemini';   // ⟵ add embedText
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

  // ✅ embed the query with Gemini (768-dim)
  const qvec = await embedText(userMsg);

  // ✅ pass the embedding to the RPC
  const { data: matches, error } = await supabase.rpc('match_chunks', {
    query_embedding: qvec,
    query_text: userMsg,
    match_count: 10,
  });
  if (error) return new Response(error.message, { status: 500 });

  const rows: DbMatch[] = (matches ?? []) as DbMatch[];
  if (rows.length === 0 || rows[0].hybrid_score < 0.20) {
    return Response.json({
      answer: "I don't have relevant context yet. Please add it on /admin.",
      references: []
    });
  }

  const withTitles: MatchWithTitle[] = await Promise.all(
    rows.map(async (m) => {
      const { data } = await supabase.from('documents').select('title').eq('id', m.doc_id).single();
      return { ...m, title: data?.title ?? null };
    })
  );

  const { ctx } = formatContext(withTitles);

  const model = getGeminiModel('gemini-1.5-flash', SYSTEM);
  const prompt = `Context:\n${ctx}\n\nQuestion: ${userMsg}\n\nAnswer with citations.`;
  const result = await model.generateContent(prompt);
  const answer = result.response.text();

  return Response.json({ answer, references: withTitles.slice(0, 6) });
}
