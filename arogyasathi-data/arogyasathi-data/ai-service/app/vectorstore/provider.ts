import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface RAGChunk {
  chunk_id: string;
  document_id: string;
  scheme_id: string;
  source_id: string;
  section: string;
  language: string;
  text: string;
  trust_tier: number;
  verified_at: Date | string;
  knowledge_version: string;
  embedding?: number[];
  content_hash: string;
}

export interface VectorStore {
  upsertChunks(chunks: RAGChunk[]): Promise<void>;
  deleteByScheme(schemeId: string): Promise<void>;
  search(queryVector: number[], k: number, filter?: Record<string, any>): Promise<RAGChunk[]>;
  health(): Promise<boolean>;
}

export class SupabaseVectorStore implements VectorStore {
  private client: SupabaseClient | null = null;

  constructor() {}

  private getClient(): SupabaseClient {
    if (this.client) return this.client;
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Vector Store runtime integration: BLOCKED - missing Supabase credentials');
    }
    this.client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    return this.client;
  }

  public async upsertChunks(chunks: RAGChunk[]): Promise<void> {
    const client = this.getClient();
    const { error } = await client.from('rag_chunks').upsert(chunks, { onConflict: 'chunk_id' });
    if (error) throw error;
  }

  public async deleteByScheme(schemeId: string): Promise<void> {
    const client = this.getClient();
    const { error } = await client.from('rag_chunks').delete().eq('scheme_id', schemeId);
    if (error) throw error;
  }

  public async search(queryVector: number[], k: number, filter?: Record<string, any>): Promise<RAGChunk[]> {
    const client = this.getClient();
    
    // For pgvector in Supabase, we usually call an RPC function (e.g. match_rag_chunks)
    // Here we'll assume the RPC function 'match_rag_chunks' is created.
    const { data, error } = await client.rpc('match_rag_chunks', {
      query_embedding: queryVector,
      match_threshold: 0.0, // Or whatever threshold you prefer
      match_count: k,
      filter_scheme_id: filter?.scheme_id || null
    });

    if (error) throw error;
    return data as RAGChunk[];
  }

  public async health(): Promise<boolean> {
    try {
      if (!process.env.SUPABASE_URL) return false;
      const client = this.getClient();
      // Just a lightweight query to verify connectivity
      const { data, error } = await client.from('rag_chunks').select('chunk_id').limit(1);
      return !error;
    } catch {
      return false;
    }
  }
}

export class MockVectorStore implements VectorStore {
  private memoryStore: RAGChunk[] = [
    {
      chunk_id: 'c1',
      document_id: 'd1',
      scheme_id: 'scheme_1',
      source_id: 'src_1',
      section: 'eligibility',
      language: 'en',
      text: 'To be eligible for scheme_1, your income must be below ₹1,20,000.',
      trust_tier: 1,
      verified_at: new Date().toISOString(),
      knowledge_version: 'v1',
      content_hash: 'hash1',
      embedding: new Array(768).fill(0.1)
    },
    {
      chunk_id: 'c2',
      document_id: 'd2',
      scheme_id: 'scheme_1',
      source_id: 'src_1',
      section: 'benefits',
      language: 'en',
      text: 'The scheme provides up to ₹5,00,000 per family per year.',
      trust_tier: 1,
      verified_at: new Date().toISOString(),
      knowledge_version: 'v1',
      content_hash: 'hash2',
      embedding: new Array(768).fill(0.1)
    }
  ];

  public async upsertChunks(chunks: RAGChunk[]): Promise<void> {
    this.memoryStore = this.memoryStore.filter(c => !chunks.find(nc => nc.chunk_id === c.chunk_id));
    this.memoryStore.push(...chunks);
  }

  public async deleteByScheme(schemeId: string): Promise<void> {
    this.memoryStore = this.memoryStore.filter(c => c.scheme_id !== schemeId);
  }

  public async search(queryVector: number[], k: number, filter?: Record<string, any>): Promise<RAGChunk[]> {
    let results = this.memoryStore;
    if (filter && filter.scheme_id) {
      results = results.filter(c => c.scheme_id === filter.scheme_id);
    }
    return results.slice(0, k);
  }

  public async health(): Promise<boolean> {
    return true;
  }
}

export const vectorStore = process.env.NODE_ENV === 'test' || !process.env.SUPABASE_URL 
  ? new MockVectorStore() 
  : new SupabaseVectorStore();
