# RAG Readiness Audit

## Current State
`NOT_IMPLEMENTED`

There is no RAG pipeline, no vector database, and no embedding generation in the repository.

## Assets Available for RAG
- The `research/` directory contains rich Markdown files detailing schemes.
- JSON configurations can be converted to textual chunks.

## Next Steps
- Implement document ingestion.
- Implement text chunking and metadata enrichment (e.g., scheme_id, state).
- Set up a vector store (like pgvector or Qdrant).
- Create a retrieval pipeline for the RAG assistant to answer citizen queries.
