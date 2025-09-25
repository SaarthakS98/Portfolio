import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabaseService } from '@/lib/supabase';
import { splitIntoChunks, type Chunk } from '@/lib/chunk';

export const runtime = 'nodejs';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

type IngestBody = {
  title?: string;
  text?: string;
  doc_type?: string;
  source_url?: string;
};

type NewChunkRow = {
  doc_id: string;
  ord: number;
  heading: string | null;
  text: string;
  tokens: number;
  embedding: number[]; // pgvector accepts number[]
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as IngestBody;
  const { title, text, doc_type, source_url } = body;
  if (!title || !text) {
    return NextResponse.json({ error: 'title & text required' }, { status: 400 });
  }

  // 1) Create document
  const { data: doc, error: dErr } = await supabaseService
    .from('documents')
    .insert({ title, doc_type, source_url })
    .select()
    .single();

  if (dErr || !doc) {
    return NextResponse.json({ error: dErr?.message ?? 'Insert failed' }, { status: 500 });
  }

  // 2) Chunk
  const chunks: Chunk[] = splitIntoChunks(text, 600, 80);

  // 3) Embed (batched)
  const embeddings: number[][] = await Promise.all(
    chunks.map(async (c): Promise<number[]> => {
      const e = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: c.text,
      });
      return e.data[0].embedding;
    }),
  );

  // 4) Upsert chunks
  const rows: NewChunkRow[] = chunks.map((c, i) => ({
    doc_id: String(doc.id),
    ord: c.ord,
    heading: c.heading ?? null,
    text: c.text,
    tokens: Math.ceil(c.text.length / 4),
    embedding: embeddings[i],
  }));

  const { error: cErr } = await supabaseService.from('chunks').insert(rows);
  if (cErr) return NextResponse.json({ error: cErr.message }, { status: 500 });

  return NextResponse.json({ ok: true, doc_id: doc.id, chunks: rows.length });
}
