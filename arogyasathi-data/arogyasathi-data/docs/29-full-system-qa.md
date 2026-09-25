# Module 13: Full-System QA

## E2E Journeys Validated
- **Deterministic Journey**: Home -> Citizen Profile -> Match -> Explanation -> Document Fetching.
- **RAG Subsystem**: Assistant Sidebar -> Scheme Query -> Cosine Context Retrieval -> LLM Generation -> Citation Resolution.
- **Admin Workflow**: Queue -> Diff Render -> Rejection / Approval Context Creation.

## Regressions Checked
- **Accessibility**: Elderly scaling triggers and visual logic overrides evaluated without breaching Deterministic Module schemas.
- **Language**: English/Tamil/Hindi switching mapped perfectly around Eligibility responses dynamically avoiding static text caching.

## Graceful Degradation QA
- Disabled Voice APIs trigger localized HTML5 WebSpeech fallbacks inherently.
- Disconnected RAG Index triggers offline fallback responses via vector-chunk metadata rendering directly.
