import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAnon } from '@/lib/supabase';
import { embedText } from '@/lib/gemini';

export async function GET(req: NextRequest) {
  const supabase = getSupabaseAnon();
  
  try {
    // Check documents
    const { data: docs, error: docError } = await supabase
      .from('documents')
      .select('*')
      .limit(5);
    
    // Check chunks
    const { data: chunks, error: chunkError } = await supabase
      .from('chunks')
      .select('*')
      .limit(3);
    
    // Test embedding
    const testEmbedding = await embedText("test query");
    
    // Test the RPC function
    const { data: rpcResult, error: rpcError } = await supabase.rpc('match_chunks_v2', {
      query_embedding: testEmbedding,
      query_text: "test",
      match_count: 3,
    });
    
    return NextResponse.json({
      documents: {
        count: docs?.length || 0,
        error: docError?.message,
        data: docs
      },
      chunks: {
        count: chunks?.length || 0,
        error: chunkError?.message,
        sample: chunks?.map(c => ({ 
          id: c.chunk_id, 
          text: c.text?.substring(0, 100) + '...',
          embedding_length: c.embedding?.length 
        }))
      },
      embedding: {
        test_length: testEmbedding.length,
        sample: testEmbedding.slice(0, 5)
      },
      rpc_function: {
        error: rpcError?.message,
        result_count: rpcResult?.length || 0,
        sample: rpcResult?.slice(0, 2)
      }
    });
    
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}