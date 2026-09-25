# Module 2: Government Scheme Knowledge System

## Overview
This module transforms the raw government-scheme JSON files into a robust, queryable canonical scheme knowledge base without modifying the original research data. It provides the foundation for the entire ArogyaSathi application.

## Components Implemented
1. **Next.js App Base (Module 1 catch-up)**: Initialized Next.js with App Router, TypeScript, and TailwindCSS in `arogyasathi-web/`.
2. **Scheme Repository (`src/lib/repository.ts`)**: Reads, normalizes, and exposes raw JSON data safely as `SchemeSummary` and `SchemeDetail` DTOs.
3. **Data Validation Script (`scripts/validate_scheme_data.js`)**: Runs thorough checks across `master/schemes.json` and nested files to prevent broken internal references and duplicate IDs. 
4. **Backend APIs**:
   - `GET /api/v1/schemes`: Lists all schemes. Supports `state` and `government_level` filters.
   - `GET /api/v1/schemes/[id]`: Retrieves complete detailed payload combining rules, benefits, documents, and application data.
   - `GET /api/v1/schemes/[id]/sources`: Retrieves official sources.
5. **Frontend Explorer (`/schemes`)**: A premium UI with animated scheme cards to browse the knowledge base.
6. **Frontend Detail Page (`/schemes/[id]`)**: Displays scheme overview, unverified warnings, benefits, and step-by-step eligibility logic.

## RAG Readiness
The `SchemeRepository` provides clean serialization of all JSON data which is easily chunkable for the upcoming RAG ingestion pipeline (Module 6).

## Research Gaps
As flagged by the validation script and UI:
- **CGHS**: Needs verification on partially outdated data points.
- **CMCHIS**: The exact current income thresholds and key figures need official validation.
- **PM-JAY**: State exclusions for West Bengal and Delhi require validation of current status.
