import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { supabaseAnon } from '@/lib/supabase';
import { SYSTEM } from '@/lib/prompt';

export const runtime = 'nodejs';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

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
  return { ctx };
}

export async function POST(req: NextRequest) {
  const { messages } = (await req.json()) as ChatRequestBody;
  const userMsg = messages?.at(-1)?.content ?? '';
  if (!userMsg) return new Response('Bad request', { status: 400 });

  // 1) Embed query
  const embRes = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: userMsg.slice(0, 2000),
  });
  const vec: number[] = embRes.data[0].embedding;

  // 2) Retrieve via RPC (no generics; cast result)
  const { data: matches, error } = await supabaseAnon.rpc('match_chunks', {
    query_embedding: vec,
    query_text: userMsg,
    match_count: 10,
  });
  if (error) return new Response(error.message, { status: 500 });

  const rows: DbMatch[] = (matches ?? []) as DbMatch[];

  // join titles
  const withTitles: MatchWithTitle[] = await Promise.all(
    rows.map(async (m) => {
      const { data } = await supabaseAnon
        .from('documents')
        .select('title')
        .eq('id', m.doc_id)
        .single();
      return { ...m, title: data?.title ?? null };
    }),
  );

  const { ctx } = formatContext(withTitles);

  // 3) Chat
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.2,
    messages: [
      { role: 'system', content: SYSTEM },
      { role: 'user', content: `Context:\n${ctx}\n\nQuestion: ${userMsg}\n\nAnswer with citations.` },
    ],
  });

  // No generic on Response.json
  return Response.json({
    answer: completion.choices[0]?.message?.content ?? null,
    references: withTitles.slice(0, 6),
  });
}
