// lib/rag/database-service.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Document, DocumentChunk, SearchResult, SearchError } from './types';

export class DatabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!url || !key) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required');
    }
    
    this.supabase = createClient(url, key);
  }

  async createDocument(
    title: string, 
    content: string, 
    metadata: Record<string, any> = {}
  ): Promise<Document> {
    const { data, error } = await this.supabase
      .from('documents')
      .insert({
        title,
        content,
        metadata
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create document: ${error.message}`);
    }

    return data as Document;
  }

  async createDocumentChunks(chunks: Omit<DocumentChunk, 'id' | 'created_at'>[]): Promise<DocumentChunk[]> {
    const { data, error } = await this.supabase
      .from('document_chunks')
      .insert(chunks)
      .select();

    if (error) {
      throw new Error(`Failed to create document chunks: ${error.message}`);
    }

    return data as DocumentChunk[];
  }

  async searchSimilarChunks(
    queryEmbedding: number[],
    matchThreshold: number = 0.3,
    matchCount: number = 10
  ): Promise<SearchResult[]> {
    try {
      const { data, error } = await this.supabase.rpc('search_documents', {
        query_embedding: queryEmbedding,
        match_threshold: matchThreshold,
        match_count: matchCount
      });

      if (error) {
        throw new SearchError(`Database search failed: ${error.message}`);
      }

      return (data || []) as SearchResult[];
    } catch (error) {
      console.error('Search failed:', error);
      throw new SearchError(
        `Failed to search documents: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getDocument(id: string): Promise<Document | null> {
    const { data, error } = await this.supabase
      .from('documents')
      .select()
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Failed to get document: ${error.message}`);
    }

    return data as Document;
  }

  async getDocumentChunks(documentId: string): Promise<DocumentChunk[]> {
    const { data, error } = await this.supabase
      .from('document_chunks')
      .select()
      .eq('document_id', documentId)
      .order('chunk_index');

    if (error) {
      throw new Error(`Failed to get document chunks: ${error.message}`);
    }

    return data as DocumentChunk[];
  }

  async deleteDocument(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete document: ${error.message}`);
    }
  }

  async listDocuments(limit: number = 50, offset: number = 0): Promise<Document[]> {
    const { data, error } = await this.supabase
      .from('documents')
      .select()
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to list documents: ${error.message}`);
    }

    return data as Document[];
  }

  async getDocumentCount(): Promise<number> {
    const { count, error } = await this.supabase
      .from('documents')
      .select('*', { count: 'exact', head: true });

    if (error) {
      throw new Error(`Failed to get document count: ${error.message}`);
    }

    return count || 0;
  }
}