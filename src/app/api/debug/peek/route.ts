import { getSupabaseAnon } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET() {
  const supabase = getSupabaseAnon();

  const { data: cnt } = await supabase.from('chunks').select('id', { count: 'exact', head: true });
  const { data: latest } = await supabase
    .from('chunks')
    .select('doc_id, ord, heading, text')
    .order('ord', { ascending: true })
    .limit(3);

  return Response.json({
    supabase_url: process.env.SUPABASE_URL, // verify same project for ingest & chat (remove later)
    chunks_count: cnt ? (cnt as unknown as { length?: number }).length ?? null : null,
    sample: (latest ?? []).map(r => ({
      doc_id: r.doc_id, ord: r.ord, heading: r.heading, preview: r.text.slice(0, 160),
    })),
  });
}
