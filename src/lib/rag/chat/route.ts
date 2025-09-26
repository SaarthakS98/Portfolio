// app/api/rag/chat/route.ts
import { NextRequest } from 'next/server';
import { RAGService } from '@/lib/rag/rag-service';
import { RAGError } from '@/lib/rag/types';

export const runtime = 'nodejs';

interface ChatRequest {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  options?: {
    maxResults?: number;
    similarityThreshold?: number;
    systemPrompt?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ChatRequest;
    
    // Validate request
    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return Response.json(
        { error: 'Messages array is required and must not be empty' },
        { status: 400 }
      );
    }

    // Get the last user message
    const userMessage = body.messages
      .filter(msg => msg.role === 'user')
      .pop();

    if (!userMessage || !userMessage.content.trim()) {
      return Response.json(
        { error: 'No user message found' },
        { status: 400 }
      );
    }

    // Initialize RAG service
    const ragService = new RAGService();
    
    // Process the chat request
    const response = await ragService.chat(userMessage.content, body.options);
    
    return Response.json(response);

  } catch (error) {
    console.error('Chat API error:', error);
    
    if (error instanceof RAGError) {
      return Response.json(
        { 
          error: error.message,
          code: error.code
        },
        { status: error.statusCode }
      );
    }
    
    return Response.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint for health check
export async function GET() {
  try {
    const ragService = new RAGService();
    const documentCount = await ragService.getDocumentCount();
    
    return Response.json({
      status: 'healthy',
      documentsInIndex: documentCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json(
      { 
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}