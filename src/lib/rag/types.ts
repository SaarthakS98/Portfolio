// lib/rag/types.ts
export interface Document {
  id: string;
  title: string;
  content: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface DocumentChunk {
  id: string;
  document_id: string;
  content: string;
  chunk_index: number;
  token_count: number;
  embedding?: number[];
  created_at: string;
}

export interface SearchResult {
  id: string;
  document_id: string;
  content: string;
  chunk_index: number;
  similarity: number;
  document_title: string;
  document_metadata: Record<string, unknown>;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  answer: string;
  sources: SearchResult[];
  metadata?: {
    query: string;
    chunks_used: number;
    model_used: string;
  };
}

// lib/rag/chunking.ts
export function splitIntoChunks(
  text: string, 
  maxTokens: number = 500, 
  overlap: number = 50
): string[] {
  // Simple sentence-based chunking
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const chunks: string[] = [];
  let currentChunk = '';
  let currentTokens = 0;

  for (const sentence of sentences) {
    const sentenceTokens = estimateTokens(sentence);
    
    if (currentTokens + sentenceTokens > maxTokens && currentChunk) {
      chunks.push(currentChunk.trim());
      
      // Handle overlap
      const overlapText = getLastWords(currentChunk, overlap);
      currentChunk = overlapText + ' ' + sentence;
      currentTokens = estimateTokens(currentChunk);
    } else {
      currentChunk += (currentChunk ? '. ' : '') + sentence;
      currentTokens += sentenceTokens;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks.filter(chunk => chunk.length > 10); // Filter out very short chunks
}

function estimateTokens(text: string): number {
  // Rough estimation: ~4 characters per token
  return Math.ceil(text.length / 4);
}

function getLastWords(text: string, maxTokens: number): string {
  const words = text.split(' ');
  const targetWords = Math.min(words.length, Math.floor(maxTokens / 1.3)); // Conservative estimate
  return words.slice(-targetWords).join(' ');
}

// lib/rag/errors.ts
export class RAGError extends Error {
  constructor(
    message: string, 
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'RAGError';
  }
}

export class EmbeddingError extends RAGError {
  constructor(message: string) {
    super(message, 'EMBEDDING_ERROR', 500);
  }
}

export class SearchError extends RAGError {
  constructor(message: string) {
    super(message, 'SEARCH_ERROR', 500);
  }
}

export class GenerationError extends RAGError {
  constructor(message: string) {
    super(message, 'GENERATION_ERROR', 500);
  }
}