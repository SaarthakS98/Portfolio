// import { NextRequest } from 'next/server';
// import { getGeminiModel, embedText } from '@/lib/gemini';
// import { getSupabaseAnon } from '@/lib/supabase';
// import { SYSTEM } from '@/lib/prompt';

// export const runtime = 'nodejs';

// type DbMatch = {
//   chunk_id: string;
//   doc_id: string;
//   ord: number;
//   heading: string | null;
//   text: string;
//   distance: number;
//   fts_rank: number;
//   hybrid_score: number;
// };
// type MatchWithTitle = DbMatch & { title: string | null };

// type Role = 'user' | 'assistant';
// type ChatMessage = { role: Role; content: string };
// type ChatRequestBody = { messages: ChatMessage[] };

// function formatContext(rows: MatchWithTitle[]) {
//   const top = rows.slice(0, 6);
//   const ctx = top
//     .map((r) => `[#${r.ord}] (${r.title ?? 'Untitled'} §${r.heading ?? ''})\n${r.text}`)
//     .join('\n\n---\n\n');
//   return { ctx, top };
// }

// export async function POST(req: NextRequest) {
//   // Allow debug mode: POST /api/chat?debug=1 to see retrieval only
//   const url = new URL(req.url);
//   const debugMode = url.searchParams.get('debug') === '1';

//   const { messages } = (await req.json()) as ChatRequestBody;
//   const userMsg = messages?.at(-1)?.content ?? '';
//   if (!userMsg) return new Response('Bad request', { status: 400 });

//   const supabase = getSupabaseAnon();

//   try {
//     // 1) Embed the query with Gemini (768-dim) and call the RPC
//     const qvec = await embedText(userMsg);   // number[] length 768
//     const { data: matches, error } = await supabase.rpc('match_chunks_v2', {
//       query_embedding: qvec,
//       query_text: userMsg,
//       match_count: 10,
//     });

//     if (error) {
//       console.error('Supabase RPC error:', error);
//       return new Response(error.message, { status: 500 });
//     }

//     const rows: DbMatch[] = (matches ?? []) as DbMatch[];

//     // 2) If nothing retrieved, short-circuit with a helpful message
//     if (rows.length === 0) {
//       return Response.json({
//         answer: "I don't have relevant context yet. Please add information about Saarthak on /admin.",
//         references: [],
//       });
//     }

//     // 3) Join titles for nicer citations (works even if title is null)
//     const withTitles: MatchWithTitle[] = await Promise.all(
//       rows.map(async (m) => {
//         const { data } = await supabase.from('documents').select('title').eq('id', m.doc_id).single();
//         return { ...m, title: data?.title ?? null };
//       })
//     );

//     // 4) Debug path: return what we retrieved (no LLM call)
//     if (debugMode) {
//       return Response.json({
//         retrieved_count: withTitles.length,
//         top5: withTitles.slice(0, 5).map((r) => ({
//           doc_id: r.doc_id,
//           title: r.title,
//           ord: r.ord,
//           heading: r.heading,
//           hybrid_score: r.hybrid_score,
//           preview: r.text.slice(0, 220),
//         })),
//       });
//     }

//     // 5) Build context for the LLM from the top chunks
//     const { ctx } = formatContext(withTitles);

//     // 6) Ask Gemini to answer strictly from the context
//     // Updated model name: gemini-2.5-flash (was gemini-1.5-flash)
//     const model = getGeminiModel('gemini-2.5-flash', SYSTEM);
//     const prompt = `Context:\n${ctx}\n\nQuestion: ${userMsg}\n\nAnswer with citations.`;
//     const result = await model.generateContent(prompt);
//     const answer = result.response.text();

//     return Response.json({ answer, references: withTitles.slice(0, 6) });

//   } catch (error) {
//     console.error('Chat error:', error);
    
//     // Fallback response
//     return Response.json({
//       answer: "I'm experiencing technical difficulties. Please try again later.",
//       error: true,
//       details: error instanceof Error ? error.message : 'Unknown error'
//     }, { status: 500 });
//   }
// }

// Temporary simple version - replace /api/chat/route.ts with this for testing
// Temporary simple version - replace /api/chat/route.ts with this for testing

// Temporary simple version - replace /api/chat/route.ts with this for testing

import { NextRequest } from 'next/server';
import { getGeminiModel } from '@/lib/gemini';
import { getSupabaseAnon } from '@/lib/supabase';

export const runtime = 'nodejs';

type ChatMessage = { role: 'user' | 'assistant'; content: string };
type ChatRequestBody = { messages: ChatMessage[] };

export async function POST(req: NextRequest) {
  const { messages } = (await req.json()) as ChatRequestBody;
  const userMsg = messages?.at(-1)?.content ?? '';
  if (!userMsg) return new Response('Bad request', { status: 400 });

  const supabase = getSupabaseAnon();

  try {
    // Get chunks and documents separately to avoid TypeScript issues
    const { data: chunks, error: chunkError } = await supabase
      .from('chunks')
      .select('chunk_id, doc_id, ord, heading, text')
      .limit(5);

    if (chunkError) {
      console.error('Chunk query error:', chunkError);
      return Response.json({
        answer: "Database error: " + chunkError.message,
        error: true
      });
    }

    if (!chunks || chunks.length === 0) {
      return Response.json({
        answer: "No content found in database. Please add some content via /admin.",
        references: []
      });
    }

    // Get document titles for the chunks
    const docIds = [...new Set(chunks.map(c => c.doc_id))];
    const { data: docs, error: docError } = await supabase
      .from('documents')
      .select('id, title')
      .in('id', docIds);

    if (docError) {
      console.error('Document query error:', docError);
    }

    // Create a map of doc_id to title
    const docTitleMap = new Map();
    docs?.forEach(doc => {
      docTitleMap.set(doc.id, doc.title);
    });

    // Format context from available chunks
    const context = chunks.map((chunk, i) => {
      const title = docTitleMap.get(chunk.doc_id) || 'Untitled';
      return `[#${i}] (${title}) ${chunk.text}`;
    }).join('\n\n---\n\n');

    console.log('Using context:', context.substring(0, 200) + '...');

    // Generate response
    const model = getGeminiModel('gemini-2.5-flash', 
      'You are a helpful assistant. Answer the user\'s question based on the provided context. If the context doesn\'t contain relevant information, say so politely.');
    
    const prompt = `Context:\n${context}\n\nQuestion: ${userMsg}\n\nAnswer:`;
    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    return Response.json({ 
      answer, 
      references: chunks.slice(0, 3).map(chunk => ({
        ...chunk,
        title: docTitleMap.get(chunk.doc_id) || 'Untitled'
      })),
      debug: { 
        chunks_found: chunks.length,
        docs_found: docs?.length || 0,
        query: userMsg
      }
    });

  } catch (error) {
    console.error('Chat error:', error);
    return Response.json({
      answer: "Technical error: " + (error instanceof Error ? error.message : 'Unknown error'),
      error: true
    }, { status: 500 });
  }
}