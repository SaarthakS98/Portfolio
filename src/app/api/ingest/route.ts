import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient, embedText } from '@/lib/gemini';
import { getSupabaseService } from '@/lib/supabase'; // if you used lazy getters earlier
import { splitIntoChunks, type Chunk } from '@/lib/chunk';

export const runtime = 'nodejs';

type IngestBody = { title?: string; text?: string; doc_type?: string; source_url?: string };
type NewChunkRow = {
  doc_id: string; ord: number; heading: string | null; text: string; tokens: number; embedding: number[];
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as IngestBody;
  const { title, text, doc_type, source_url } = body;
  if (!title || !text) return NextResponse.json({ error: 'title & text required' }, { status: 400 });

  // initialize clients (ensures env present)
  getGeminiClient();
  const supabase = getSupabaseService();

  const { data: doc, error: dErr } = await supabase
    .from('documents')
    .insert({ title, doc_type, source_url })
    .select()
    .single();
  if (dErr || !doc) return NextResponse.json({ error: dErr?.message ?? 'Insert failed' }, { status: 500 });

  const chunks: Chunk[] = splitIntoChunks(text, 600, 80);

  const embeddings: number[][] = await Promise.all(chunks.map(c => embedText(c.text)));

  const rows: NewChunkRow[] = chunks.map((c, i) => ({
    doc_id: String(doc.id),
    ord: c.ord,
    heading: c.heading ?? null,
    text: c.text,
    tokens: Math.ceil(c.text.length / 4),
    embedding: embeddings[i],
  }));

  const { error: cErr } = await supabase.from('chunks').insert(rows);
  if (cErr) return NextResponse.json({ error: cErr.message }, { status: 500 });

  return NextResponse.json({ ok: true, doc_id: doc.id, chunks: rows.length });
}
