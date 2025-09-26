// import { NextRequest } from 'next/server';

// export const runtime = 'nodejs';

// interface ChatRequest {
//   messages: Array<{ role: 'user' | 'assistant'; content: string }>;
// }

// // Temporary simple version until you set up the full RAG system
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json() as ChatRequest;
    
//     // Validate request
//     if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
//       return Response.json(
//         { error: 'Messages array is required and must not be empty' },
//         { status: 400 }
//       );
//     }

//     // Get the last user message
//     const userMessage = body.messages
//       .filter(msg => msg.role === 'user')
//       .pop();

//     if (!userMessage || !userMessage.content.trim()) {
//       return Response.json(
//         { error: 'No user message found' },
//         { status: 400 }
//       );
//     }

//     // Simple response for now (you can replace this with the full RAG service later)
//     const responses = {
//       "tell me about software testing": "Software testing is a course that prepares students to understand the phases of testing based on requirements for a project. Students learn to apply concepts to formulate test requirements precisely, design and execute test cases as part of standard software development, and apply specially designed test case design techniques for specific application domains.",
//       "tell me about saarthak": "I don't have detailed information about Saarthak yet. Please add more documents about Saarthak through the admin interface.",
//       "who is saarthak": "Saarthak Singhal is a software developer and student with interests in machine learning, AI, and web development. He has experience with technologies like Next.js, TypeScript, Python, and RAG systems."
//     };

//     const query = userMessage.content.toLowerCase();
//     let answer = "I don't have specific information about that topic yet. Please add relevant documents through the admin interface, or try asking about software testing or general information about Saarthak.";

//     // Simple keyword matching
//     for (const [key, value] of Object.entries(responses)) {
//       if (query.includes(key.toLowerCase()) || key.toLowerCase().includes(query)) {
//         answer = value;
//         break;
//       }
//     }

//     return Response.json({
//       answer,
//       sources: [],
//       metadata: {
//         query: userMessage.content,
//         chunks_used: 0,
//         model_used: 'simple-response'
//       }
//     });

//   } catch (error) {
//     console.error('Chat API error:', error);
    
//     return Response.json(
//       { 
//         error: 'Internal server error',
//         details: error instanceof Error ? error.message : 'Unknown error'
//       },
//       { status: 500 }
//     );
//   }
// }

// // Health check endpoint
// export async function GET() {
//   return Response.json({
//     status: 'healthy',
//     documentsInIndex: 0,
//     timestamp: new Date().toISOString(),
//     message: 'Simple RAG endpoint - replace with full implementation'
//   });
// }

import { NextRequest } from 'next/server';
import { getSupabaseAnon } from '@/lib/supabase';
import { getGeminiModel, embedText } from '@/lib/gemini';
import { SYSTEM } from '@/lib/prompt';

export const runtime = 'nodejs';

type DbMatch = {
  chunk_id: string;
  doc_id: string;
  ord: number;
  heading: string | null;
  text: string;
  distance: number;        // from pgvector: smaller is closer
  fts_rank: number | null; // optional
  hybrid_score: number | null; // optional
  title?: string;          // joined later
};

interface ChatRequest {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  options?: { k?: number; similarity?: number };
}

export async function POST(req: NextRequest) {
  try {
    const { messages, options } = (await req.json()) as ChatRequest;
    if (!messages?.length) {
      return Response.json({ error: 'messages required' }, { status: 400 });
    }

    const userMsg = messages[messages.length - 1].content?.trim();
    if (!userMsg) {
      return Response.json({ error: 'last user message empty' }, { status: 400 });
    }

    // 1) Embed the query
    const queryEmbedding = await embedText(userMsg);

    // 2) Retrieve similar chunks from Supabase (RPC must exist; see SQL below)
    const supabase = getSupabaseAnon();
    const k = options?.k ?? 8;
    const similarity = options?.similarity ?? 0.2;

    const { data: matches, error: rpcErr } = await supabase.rpc('match_chunks', {
      query_embedding: queryEmbedding,
      query_text: userMsg,
      match_count: k,
      similarity_threshold: similarity,
    });

    if (rpcErr) {
      return Response.json({ error: `match_chunks RPC failed: ${rpcErr.message}` }, { status: 500 });
    }

    const rows: DbMatch[] = Array.isArray(matches) ? matches : [];

    // 3) Join titles for citations
    const docIds = [...new Set(rows.map(r => r.doc_id))];
    let titles: Record<string, string> = {};
    if (docIds.length) {
      const { data: docs, error: docErr } = await supabase
        .from('documents')
        .select('id, title')
        .in('id', docIds);
      if (docErr) {
        return Response.json({ error: `documents fetch failed: ${docErr.message}` }, { status: 500 });
      }
      titles = Object.fromEntries((docs ?? []).map(d => [String(d.id), d.title]));
    }
    const withTitles = rows.map(r => ({ ...r, title: titles[String(r.doc_id)] || 'Untitled' }));

    // 4) Build context for the LLM
    const ctx = withTitles
      .slice(0, k)
      .map(r => `【${r.title} §${r.heading ?? '…'} #${r.ord}】\n${r.text}`)
      .join('\n\n---\n\n');

    const model = getGeminiModel('gemini-2.5-flash', SYSTEM);
    const prompt = `Context:\n${ctx}\n\nQuestion: ${userMsg}\n\nAnswer with citations in the form [title §heading #ord]. If not in context, say you don't know.`;
    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    return Response.json({ answer, references: withTitles.slice(0, k) });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}

export async function GET() {
  return Response.json({
    status: 'ok',
    message: 'RAG chat endpoint live',
    timestamp: new Date().toISOString(),
  });
}
