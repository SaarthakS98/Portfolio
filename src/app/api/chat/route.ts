import { NextRequest } from 'next/server';
import { getOpenAI } from '@/lib/openai';
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
  const ctx = top.map(r =>
    `[#${r.ord}] (${r.title ?? 'Untitled'} §${r.heading ?? ''})\n${r.text}`
  ).join('\n\n---\n\n');
  return { ctx };
}

export async function POST(req: NextRequest) {
  const { messages } = (await req.json()) as ChatRequestBody;
  const userMsg = messages?.at(-1)?.content ?? '';
  if (!userMsg) return new Response('Bad request', { status: 400 });

  const openai = getOpenAI();
  const supabase = getSupabaseAnon();

  // Embed query
  const embRes = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: userMsg.slice(0, 2000),
  });
  const vec: number[] = embRes.data[0].embedding;

  // Retrieve via RPC
  const { data: matches, error } = await supabase.rpc('match_chunks', {
    query_embedding: vec,
    query_text: userMsg,
    match_count: 10,
  });
  if (error) return new Response(error.message, { status: 500 });
  const rows: DbMatch[] = (matches ?? []) as DbMatch[];

  // Join titles
  const withTitles: MatchWithTitle[] = await Promise.all(
    rows.map(async (m) => {
      const { data } = await supabase.from('documents').select('title').eq('id', m.doc_id).single();
      return { ...m, title: data?.title ?? null };
    })
  );

  const { ctx } = formatContext(withTitles);

  // Chat
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.2,
    messages: [
      { role: 'system', content: SYSTEM },
      { role: 'user', content: `Context:\n${ctx}\n\nQuestion: ${userMsg}\n\nAnswer with citations.` },
    ],
  });

  return Response.json({
    answer: completion.choices[0]?.message?.content ?? null,
    references: withTitles.slice(0, 6),
  });
}
