# Module 7: Advanced Scheme Explorer, Contextual RAG & Factual Comparison

## Overview
Module 7 completes the discovery journey for citizens by providing a powerful, filter-driven Scheme Explorer paired with an advanced Contextual RAG assistant. Citizens can search, filter, and dive deep into scheme specifics. Critically, it allows side-by-side factual comparisons of multiple schemes without making subjective "best scheme" recommendations, keeping eligibility decisions safely partitioned to the core determinist engine.

## Key Features

### Advanced Scheme Explorer
- **Normalized Search**: Search is case-insensitive, typo-tolerant (via tokenized string matching), and searches across names, aliases, target groups, and states simultaneously.
- **Dynamic Filtering**: The `DiscoveryService` scans the canonical knowledge base on boot to establish the exact Set of available States and Target Groups, feeding the frontend dropdowns organically. No hardcoding is required.
- **URL-Aware Navigation**: Filters push their state into the URL params (`?q=...&state=...`), enabling easy browser back/forward flows and link sharing.

### Factual Comparison Engine
- The `/api/v1/schemes/compare` API accepts an array of scheme IDs and normalizes their nested canonical data (e.g., benefits, cashless support, documents required) into a flat comparison grid.
- Missing or `null` data safely renders as "Not specified" or "Unknown", guaranteeing no LLM hallucinations fill in the gaps.
- Comparison UI supports up to 3 schemes at a time to remain accessible and responsive without heavy horizontal scrolling.

### Contextual RAG on Details Page
- When navigating to a specific scheme's details page (e.g., `/schemes/PMJAY`), a floating Contextual Assistant is available. 
- Opening it automatically injects `scheme_id` into the RAG context, heavily boosting retrieval precision. Questions like "What are the rules?" automatically infer the current scheme context without user specification.

### Data Completeness & Status Transparency
- Result cards highlight the explicit `last_updated` verified tags from the underlying canonical files.

## Integration Architecture
- `DiscoveryService` (backend) connects to `SchemeRepository` (canonical data).
- Search parameters are fed to `DiscoveryService.search()`, generating lightweight DTOs (`SchemeDiscoveryCard`) rather than loading heavy MBs of JSON payloads into the frontend.
- Side-by-side comparison calls `DiscoveryService.compare()` to dynamically hydrate exact fields.

## Security & Safety
- **No Eligibility Hallucination**: RAG queries spawned from the scheme detail page follow the identical strict constraints created in Module 6. It cannot override or guess eligibility.
- **Strict Parameter Passing**: Comparison ID parameters are capped at 3, and malformed arrays are handled gracefully by the backend API.

## Frontend UI Upgrades
- Completely transformed `/schemes` with a hero section, sidebar filters, grid cards, and animated compare-selection toggles.
- Redesigned `/schemes/[id]` to present benefits and documents via highly scannable, icon-rich feature lists, rather than raw JSON dumps.
- Upgraded the floating contextual RAG drawer with quick-prompt chips.
