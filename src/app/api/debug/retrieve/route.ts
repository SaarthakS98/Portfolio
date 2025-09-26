// import { NextRequest } from 'next/server';
// import { embedText } from '@/lib/gemini';
// import { getSupabaseAnon } from '@/lib/supabase';

// export const runtime = 'nodejs';

// type DbMatch = {
//   chunk_id: string; doc_id: string; ord: number; heading: string | null;
//   text: string; distance: number; fts_rank: number; hybrid_score: number;
// };

// export async function POST(req: NextRequest) {
//   const { q } = await req.json() as { q: string };
//   if (!q) return new Response('Missing q', { status: 400 });

//   const supabase = getSupabaseAnon();
//   const qvec = await embedText(q); // 768-d

//   const { data: matches, error } = await supabase.rpc('match_chunks_v2', {
//   query_embedding: qvec,   // number[]
//   query_text: q,
//   match_count: 10,
// });

//   if (error) return new Response(error.message, { status: 500 });

//   const rows: DbMatch[] = (matches ?? []) as DbMatch[];
//   return Response.json({
//     retrieved_count: rows.length,
//     top5: rows.slice(0, 5).map(r => ({
//       doc_id: r.doc_id, ord: r.ord, heading: r.heading,
//       hybrid_score: r.hybrid_score, preview: r.text.slice(0, 200),
//     }))
//   });
// }

import { NextRequest } from 'next/server';
import { embedText } from '@/lib/gemini';
import { getSupabaseAnon } from '@/lib/supabase';

export const runtime = 'nodejs';

type Row = { chunk_id: string; doc_id: string; ord: number; heading: string | null; text: string; distance: number };

export async function POST(req: NextRequest) {
  const { q } = (await req.json()) as { q: string };
  if (!q) return new Response('Missing q', { status: 400 });

  const supabase = getSupabaseAnon();
  const qvec = await embedText(q); // number[] (768-d)

  const { data, error } = await supabase.rpc('knn_chunks', {
    query_embedding: qvec,
    k: 5,
  });
  if (error) return new Response(error.message, { status: 500 });

  const rows = (data ?? []) as Row[];
  return Response.json({
    retrieved_count: rows.length,
    top5: rows.slice(0, 5).map(r => ({
      doc_id: r.doc_id,
      ord: r.ord,
      heading: r.heading,
      distance: r.distance,
      preview: r.text.slice(0, 200),
    })),
  });
}

