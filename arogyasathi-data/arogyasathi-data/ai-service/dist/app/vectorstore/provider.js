"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vectorStore = exports.MockVectorStore = exports.MongoVectorStore = void 0;
const mongodb_1 = require("mongodb");
class MongoVectorStore {
    client = null;
    db = null;
    collection = null;
    constructor() { }
    async getCollection() {
        if (this.collection)
            return this.collection;
        if (!process.env.VECTOR_STORE_URL) {
            throw new Error('Vector Store runtime integration: BLOCKED - awaiting project owner configuration');
        }
        this.client = new mongodb_1.MongoClient(process.env.VECTOR_STORE_URL);
        await this.client.connect();
        this.db = this.client.db();
        this.collection = this.db.collection('rag_chunks');
        return this.collection;
    }
    async upsertChunks(chunks) {
        const col = await this.getCollection();
        // Use bulk write for upserts based on chunk_id
        const operations = chunks.map(chunk => ({
            updateOne: {
                filter: { chunk_id: chunk.chunk_id },
                update: { $set: chunk },
                upsert: true
            }
        }));
        if (operations.length > 0) {
            await col.bulkWrite(operations);
        }
    }
    async deleteByScheme(schemeId) {
        const col = await this.getCollection();
        await col.deleteMany({ scheme_id: schemeId });
    }
    async search(queryVector, k, filter) {
        const col = await this.getCollection();
        // Using MongoDB Atlas Vector Search syntax
        const pipeline = [
            {
                $vectorSearch: {
                    index: "vector_index",
                    path: "embedding",
                    queryVector: queryVector,
                    numCandidates: k * 10,
                    limit: k,
                    ...(filter && { filter: filter })
                }
            }
        ];
        const results = await col.aggregate(pipeline).toArray();
        return results;
    }
    async health() {
        try {
            if (!process.env.VECTOR_STORE_URL)
                return false;
            const col = await this.getCollection();
            await col.findOne();
            return true;
        }
        catch {
            return false;
        }
    }
}
exports.MongoVectorStore = MongoVectorStore;
class MockVectorStore {
    memoryStore = [
        {
            chunk_id: 'c1',
            document_id: 'd1',
            scheme_id: 'scheme_1',
            source_id: 'src_1',
            section: 'eligibility',
            language: 'en',
            text: 'To be eligible for scheme_1, your income must be below ₹1,20,000.',
            trust_tier: 1,
            verified_at: new Date(),
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
            verified_at: new Date(),
            knowledge_version: 'v1',
            content_hash: 'hash2',
            embedding: new Array(768).fill(0.1)
        }
    ];
    async upsertChunks(chunks) {
        this.memoryStore = this.memoryStore.filter(c => !chunks.find(nc => nc.chunk_id === c.chunk_id));
        this.memoryStore.push(...chunks);
    }
    async deleteByScheme(schemeId) {
        this.memoryStore = this.memoryStore.filter(c => c.scheme_id !== schemeId);
    }
    async search(queryVector, k, filter) {
        let results = this.memoryStore;
        if (filter && filter.scheme_id) {
            results = results.filter(c => c.scheme_id === filter.scheme_id);
        }
        return results.slice(0, k);
    }
    async health() {
        return true;
    }
}
exports.MockVectorStore = MockVectorStore;
exports.vectorStore = process.env.NODE_ENV === 'test' || !process.env.VECTOR_STORE_URL
    ? new MockVectorStore()
    : new MongoVectorStore();
