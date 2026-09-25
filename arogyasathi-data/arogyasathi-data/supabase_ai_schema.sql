-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create rag_chunks table
CREATE TABLE rag_chunks (
    chunk_id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL,
    scheme_id TEXT NOT NULL,
    source_id TEXT NOT NULL,
    section TEXT NOT NULL,
    language TEXT NOT NULL,
    text TEXT NOT NULL,
    trust_tier INTEGER NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE NOT NULL,
    knowledge_version TEXT NOT NULL,
    embedding VECTOR(768), -- Assumes a 768-dimensional embedding, adjust if using different model
    content_hash TEXT NOT NULL
);

-- Create HNSW index on the embedding for fast similarity search
CREATE INDEX ON rag_chunks USING hnsw (embedding vector_cosine_ops);
-- Or for IVFFlat (if preferred): CREATE INDEX ON rag_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create an RPC function that acts like MongoDB Atlas Vector Search
CREATE OR REPLACE FUNCTION match_rag_chunks(
    query_embedding VECTOR(768),
    match_threshold FLOAT,
    match_count INT,
    filter_scheme_id TEXT DEFAULT NULL
)
RETURNS TABLE (
    chunk_id TEXT,
    document_id TEXT,
    scheme_id TEXT,
    source_id TEXT,
    section TEXT,
    language TEXT,
    text TEXT,
    trust_tier INTEGER,
    verified_at TIMESTAMP WITH TIME ZONE,
    knowledge_version TEXT,
    content_hash TEXT,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        rag_chunks.chunk_id,
        rag_chunks.document_id,
        rag_chunks.scheme_id,
        rag_chunks.source_id,
        rag_chunks.section,
        rag_chunks.language,
        rag_chunks.text,
        rag_chunks.trust_tier,
        rag_chunks.verified_at,
        rag_chunks.knowledge_version,
        rag_chunks.content_hash,
        1 - (rag_chunks.embedding <=> query_embedding) AS similarity
    FROM
        rag_chunks
    WHERE
        (filter_scheme_id IS NULL OR rag_chunks.scheme_id = filter_scheme_id)
        AND 1 - (rag_chunks.embedding <=> query_embedding) > match_threshold
    ORDER BY
        rag_chunks.embedding <=> query_embedding
    LIMIT
        match_count;
END;
$$;
