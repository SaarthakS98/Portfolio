// lib/rag/rag-service.ts
import { AIService } from './ai-service';
import { DatabaseService } from './database-service';
import { splitIntoChunks } from './types';
import { ChatResponse, SearchResult } from './types';

export class RAGService {
  private aiService: AIService;
  private dbService: DatabaseService;

  constructor() {
    this.aiService = new AIService();
    this.dbService = new DatabaseService();
  }

  async ingestDocument(
    title: string,
    content: string,
    metadata: Record<string, any> = {}
  ): Promise<{ documentId: string; chunksCreated: number }> {
    // Create the document
    const document = await this.dbService.createDocument(title, content, metadata);
    
    // Split content into chunks
    const textChunks = splitIntoChunks(content, 500, 50);
    
    // Generate embeddings for all chunks
    console.log(`Generating embeddings for ${textChunks.length} chunks...`);
    const embeddings = await this.aiService.batchGenerateEmbeddings(textChunks);
    
    // Prepare chunk objects
    const chunks = textChunks.map((chunk, index) => ({
      document_id: document.id,
      content: chunk,
      chunk_index: index,
      token_count: Math.ceil(chunk.length / 4), // Rough estimation
      embedding: embeddings[index]
    }));
    
    // Save chunks to database
    await this.dbService.createDocumentChunks(chunks);
    
    console.log(`Successfully ingested document "${title}" with ${chunks.length} chunks`);
    
    return {
      documentId: document.id,
      chunksCreated: chunks.length
    };
  }

  async chat(
    query: string,
    options: {
      maxResults?: number;
      similarityThreshold?: number;
      systemPrompt?: string;
    } = {}
  ): Promise<ChatResponse> {
    const {
      maxResults = 5,
      similarityThreshold = 0.3,
      systemPrompt
    } = options;

    // Generate embedding for the query
    const queryEmbedding = await this.aiService.generateEmbedding(query);
    
    // Search for similar chunks
    const searchResults = await this.dbService.searchSimilarChunks(
      queryEmbedding,
      similarityThreshold,
      maxResults
    );
    
    if (searchResults.length === 0) {
      return {
        answer: "I don't have any relevant information to answer your question. Please make sure documents have been uploaded to the knowledge base.",
        sources: [],
        metadata: {
          query,
          chunks_used: 0,
          model_used: 'gemini-2.5-flash'
        }
      };
    }
    
    // Format context from search results
    const context = this.formatContext(searchResults);
    
    // Generate response
    const answer = await this.aiService.generateResponse(query, context, systemPrompt);
    
    return {
      answer,
      sources: searchResults,
      metadata: {
        query,
        chunks_used: searchResults.length,
        model_used: 'gemini-2.5-flash'
      }
    };
  }

  private formatContext(results: SearchResult[]): string {
    return results
      .map((result, index) => {
        return `[${index + 1}] From "${result.document_title}":\n${result.content}`;
      })
      .join('\n\n---\n\n');
  }

  async getDocuments() {
    return this.dbService.listDocuments();
  }

  async getDocumentCount() {
    return this.dbService.getDocumentCount();
  }

  async deleteDocument(id: string) {
    return this.dbService.deleteDocument(id);
  }
}