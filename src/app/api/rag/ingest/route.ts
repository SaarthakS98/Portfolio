import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

interface IngestRequest {
  title: string;
  content: string;
  metadata?: Record<string, unknown>;
}

// Temporary simple version
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as IngestRequest;
    
    // Validate request
    if (!body.title || !body.title.trim()) {
      return Response.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!body.content || !body.content.trim()) {
      return Response.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // For now, just log the content (replace with actual database storage later)
    console.log('Document received:', {
      title: body.title,
      contentLength: body.content.length,
      metadata: body.metadata
    });
    
    return Response.json({
      success: true,
      documentId: 'temp-' + Date.now(),
      chunksCreated: Math.ceil(body.content.length / 500), // Estimate
      message: `Successfully received document "${body.title}" (temporary implementation)`
    });

  } catch (error) {
    console.error('Ingest API error:', error);
    
    return Response.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to list documents (temporary)
export async function GET() {
  return Response.json({
    documents: [],
    count: 0,
    message: 'Temporary implementation - no documents stored yet'
  });
}