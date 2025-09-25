import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { supabaseAnon } from '@/lib/supabase';
import { SYSTEM } from '@/lib/prompt';

export const runtime = 'nodejs';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

function formatContext(rows: any[]) {
  const top = rows.slice(0, 6);
  const ctx = top.map((r: any) =>
    `[#${r.ord}] (${r.title ?? 'Untitled'} §${r.heading ?? ''})\n${r.text}`
  ).join('\n\n---\n\n');
  return { ctx };
}

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const userMsg: string = messages?.at(-1)?.content ?? '';
  if (!userMsg) return new Response('Bad request', { status: 400 });

  const emb = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: userMsg.slice(0, 2000)
  });
  const vec = emb.data[0].embedding;

  const { data: matches, error } = await supabaseAnon.rpc('match_chunks', {
    query_embedding: vec as any,
    query_text: userMsg,
    match_count: 10
  });
  if (error) return new Response(error.message, { status: 500 });

  const withTitles = await Promise.all((matches ?? []).map(async (m: any) => {
    const { data } = await supabaseAnon
      .from('documents')
      .select('title')
      .eq('id', m.doc_id)
      .single();
    return { ...m, title: data?.title };
  }));

  const { ctx } = formatContext(withTitles);

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.2,
    messages: [
      { role: 'system', content: SYSTEM },
      { role: 'user', content: `Context:\n${ctx}\n\nQuestion: ${userMsg}\n\nAnswer with citations.` }
    ],
    stream: false
  });

  return Response.json({
    answer: completion.choices[0].message.content,
    references: withTitles.slice(0, 6)
  });
}
