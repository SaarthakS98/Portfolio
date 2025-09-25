import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabaseService } from '@/lib/supabase';
import { splitIntoChunks } from '@/lib/chunk';

export const runtime = 'nodejs';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  // expects JSON: { title, doc_type?, source_url?, text }
  const body = await req.json();
  const { title, text, doc_type, source_url } = body || {};
  if (!title || !text) return NextResponse.json({ error: 'title & text required' }, { status: 400 });

  // 1) create document
  const { data: doc, error: dErr } = await supabaseService
    .from('documents')
    .insert({ title, doc_type, source_url })
    .select()
    .single();
  if (dErr) return NextResponse.json({ error: dErr.message }, { status: 500 });

  // 2) chunk
  const chunks = splitIntoChunks(text, 600, 80);

  // 3) embed batched
  const embeddings = await Promise.all(chunks.map(async c => {
    const e = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: c.text
    });
    return e.data[0].embedding;
  }));

  // 4) upsert
  const rows = chunks.map((c, i) => ({
    doc_id: doc.id,
    ord: c.ord,
    heading: c.heading ?? null,
    text: c.text,
    tokens: Math.ceil(c.text.length / 4),
    embedding: embeddings[i] as unknown as any
  }));

  const { error: cErr } = await supabaseService.from('chunks').insert(rows as any);
  if (cErr) return NextResponse.json({ error: cErr.message }, { status: 500 });

  return NextResponse.json({ ok: true, doc_id: doc.id, chunks: rows.length });
}
