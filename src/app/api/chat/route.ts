import { NextRequest } from 'next/server';
import { getGeminiModel, embedText } from '@/lib/gemini';
import { getSupabaseAnon } from '@/lib/supabase';
import { SYSTEM } from '@/lib/prompt';

export const runtime = 'nodejs';

type DbMatch = {
  chunk_id: string;
  doc_id: string;
  ord: number;
  heading: string | null;
  text: string;
  distance: number;
  fts_rank: number;
  hybrid_score: number;
};
type MatchWithTitle = DbMatch & { title: string | null };

type Role = 'user' | 'assistant';
type ChatMessage = { role: Role; content: string };
type ChatRequestBody = { messages: ChatMessage[] };

function formatContext(rows: MatchWithTitle[]) {
  const top = rows.slice(0, 6);
  const ctx = top
    .map((r) => `[#${r.ord}] (${r.title ?? 'Untitled'} §${r.heading ?? ''})\n${r.text}`)
    .join('\n\n---\n\n');
  return { ctx, top };
}

export async function POST(req: NextRequest) {
  // Allow debug mode: POST /api/chat?debug=1 to see retrieval only
  const url = new URL(req.url);
  const debugMode = url.searchParams.get('debug') === '1';

  const { messages } = (await req.json()) as ChatRequestBody;
  const userMsg = messages?.at(-1)?.content ?? '';
  if (!userMsg) return new Response('Bad request', { status: 400 });

  const supabase = getSupabaseAnon();

  // 1) Embed the query with Gemini (768-dim) and call the RPC

  const qvec = await embedText(userMsg);   // number[] length 768
  const { data: matches, error } = await supabase.rpc('match_chunks_v2', {
    query_embedding: qvec,
    query_text: userMsg,
    match_count: 10,
  });

  if (error) return new Response(error.message, { status: 500 });

  const rows: DbMatch[] = (matches ?? []) as DbMatch[];

  // 2) If nothing retrieved, short-circuit with a helpful message
  if (rows.length === 0) {
    return Response.json({
      answer: "I don't have relevant context yet. Please add it on /admin.",
      references: [],
    });
  }

  // 3) Join titles for nicer citations (works even if title is null)
  const withTitles: MatchWithTitle[] = await Promise.all(
    rows.map(async (m) => {
      const { data } = await supabase.from('documents').select('title').eq('id', m.doc_id).single();
      return { ...m, title: data?.title ?? null };
    })
  );

  // 4) Debug path: return what we retrieved (no LLM call)
  if (debugMode) {
    return Response.json({
      retrieved_count: withTitles.length,
      top5: withTitles.slice(0, 5).map((r) => ({
        doc_id: r.doc_id,
        title: r.title,
        ord: r.ord,
        heading: r.heading,
        hybrid_score: r.hybrid_score,
        preview: r.text.slice(0, 220),
      })),
    });
  }

  // 5) Build context for the LLM from the top chunks
  const { ctx } = formatContext(withTitles);

  // 6) Ask Gemini to answer strictly from the context
  const model = getGeminiModel('gemini-1.5-flash', SYSTEM); // fast & cheap
  const prompt = `Context:\n${ctx}\n\nQuestion: ${userMsg}\n\nAnswer with citations.`;
  const result = await model.generateContent(prompt);
  const answer = result.response.text();

  return Response.json({ answer, references: withTitles.slice(0, 6) });
}
