# Module 13: Performance Baseline

## API Targets
- **Eligibility Evaluate**: Under 50ms (Deterministic JSON operations).
- **RAG Search (Cosine + LLM)**: ~1500ms - 3000ms.
- **Profile Normalization**: ~1500ms.

## Caching & Layout
- Re-architected frontend routes via Next.js Turbopack, establishing static generations (`○`) across standard pathways, reserving dynamic evaluation (`ƒ`) strictly for API validations.

## Optimizations
- Stripped heavy frontend state operations out of React DOM lifecycle where possible.
- Next.js 15 route proxy explicitly strips invalid internal requests avoiding N+1 layout cascading.
