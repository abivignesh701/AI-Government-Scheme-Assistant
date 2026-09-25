"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.embeddingService = exports.MockEmbeddingProvider = void 0;
class MockEmbeddingProvider {
    dimension = 768; // Standard dimension for many multilingual models
    modelName = 'mock-multilingual-embedding';
    async embedQuery(text) {
        if (process.env.NODE_ENV !== 'test' && !process.env.EMBEDDING_PROVIDER) {
            throw new Error('Embedding runtime integration: BLOCKED - awaiting project owner configuration');
        }
        return new Array(this.dimension).fill(0.1);
    }
    async embedDocuments(texts) {
        if (!process.env.EMBEDDING_PROVIDER) {
            throw new Error('Embedding runtime integration: BLOCKED - awaiting project owner configuration');
        }
        return texts.map(() => new Array(this.dimension).fill(0.1));
    }
}
exports.MockEmbeddingProvider = MockEmbeddingProvider;
exports.embeddingService = new MockEmbeddingProvider();
