// lib/rag/ai-service.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { EmbeddingError, GenerationError } from './types';

export class AIService {
  private client: GoogleGenerativeAI;
  
  constructor() {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY environment variable is required');
    }
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const model = this.client.getGenerativeModel({ 
        model: 'text-embedding-004' 
      });
      
      const result = await model.embedContent(text);
      
      if (!result.embedding?.values) {
        throw new EmbeddingError('No embedding values returned');
      }
      
      return result.embedding.values;
    } catch (error) {
      console.error('Embedding generation failed:', error);
      throw new EmbeddingError(
        `Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async generateResponse(
    query: string, 
    context: string,
    systemPrompt?: string
  ): Promise<string> {
    try {
      const defaultSystemPrompt = `You are a helpful AI assistant. Answer the user's question based on the provided context. If the context doesn't contain enough information to answer the question, say so politely. Always be accurate and cite relevant information from the context when possible.`;
      
      const model = this.client.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        systemInstruction: systemPrompt || defaultSystemPrompt
      });

      const prompt = `Context:
${context}

Question: ${query}

Answer:`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      
      if (!response.text()) {
        throw new GenerationError('Empty response from model');
      }
      
      return response.text();
    } catch (error) {
      console.error('Response generation failed:', error);
      throw new GenerationError(
        `Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async batchGenerateEmbeddings(texts: string[]): Promise<number[][]> {
    // For now, generate embeddings sequentially
    // In production, you might want to batch these or use Promise.all with rate limiting
    const embeddings: number[][] = [];
    
    for (const text of texts) {
      const embedding = await this.generateEmbedding(text);
      embeddings.push(embedding);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return embeddings;
  }
}