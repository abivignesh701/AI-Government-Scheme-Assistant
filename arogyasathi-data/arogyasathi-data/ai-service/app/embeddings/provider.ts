export interface EmbeddingProvider {
  embedQuery(text: string): Promise<number[]>;
  embedDocuments(texts: string[]): Promise<number[][]>;
  dimension: number;
  modelName: string;
}

export class MockEmbeddingProvider implements EmbeddingProvider {
  public dimension = 768; // Standard dimension for many multilingual models
  public modelName = 'mock-multilingual-embedding';

  public async embedQuery(text: string): Promise<number[]> {
    if (process.env.NODE_ENV !== 'test' && !process.env.EMBEDDING_PROVIDER) {
      throw new Error('Embedding runtime integration: BLOCKED - awaiting project owner configuration');
    }
    return new Array(this.dimension).fill(0.1);
  }

  public async embedDocuments(texts: string[]): Promise<number[][]> {
    if (!process.env.EMBEDDING_PROVIDER) {
      throw new Error('Embedding runtime integration: BLOCKED - awaiting project owner configuration');
    }
    return texts.map(() => new Array(this.dimension).fill(0.1));
  }
}

export const embeddingService = new MockEmbeddingProvider();
