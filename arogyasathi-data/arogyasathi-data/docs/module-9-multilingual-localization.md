# Module 9: Multilingual Localization Architecture

## Overview
ArogyaSathi supports English, Tamil, and Hindi through a unified localization architecture. The core principle is that **language only changes presentation, never facts or eligibility logic.**

## Architecture
```text
Canonical Data
        ↓
Language-Independent Business Logic (Backend Reason Codes, Statuses)
        ↓
Stable Codes / Structured Facts
        ↓
Localization Layer (i18next in Frontend)
        ↓
English / Tamil / Hindi
```

## Frontend i18n
The frontend leverages `i18next` and `react-i18next`. 
- Locales are stored in `src/locales/{lang}/common.json`.
- State is preserved across language switches since `next-intl`/`react-i18next` handles translation dynamically without full page reloads.
- Preference is prioritized by: Saved authenticated preference > LocalStorage > Navigator language > Fallback (English).

## Backend Localization
The backend strictly avoids returning English business logic. Instead, it returns structured codes:
```json
{
  "reason_code": "INCOME_ABOVE_MAXIMUM",
  "params": {
    "maximum_income": 120000
  }
}
```
The frontend maps `INCOME_ABOVE_MAXIMUM` to `eligibility.reasons.INCOME_ABOVE_MAXIMUM` which handles the placeholder `{{maximum_income}}`.

## AI Service Multilingualism
The AI orchestrator explicitly instructs the LLM: `Respond entirely in the requested language: {language}`.
It also enforces:
- Preservation of exact numeric facts.
- Preservation of deterministic eligibility status.
- Preservation of official scheme names.

## Cross-Language RAG
- The vector store is populated with chunks that include a `language` tag.
- Multilingual embeddings (`text-embedding-multilingual`) allow a query in Tamil to retrieve English source documents.
- The LLM then synthesizes the English evidence into a Tamil response while preserving numerical facts and citations.

## Transliteration
- Queries containing Tanglish or Hinglish are embedded and handled gracefully by modern multilingual embeddings and LLMs without strict pre-processing dictionaries.

## Translation QA & Parity
- A script `scripts/validate-translations.js` runs in CI to verify that all translation keys and placeholders (`{{variable}}`) exist across all supported locales (en, ta, hi).

## Accessibility
- When the locale changes, `document.documentElement.lang` is updated to `en`, `ta`, or `hi` to ensure screen readers use the correct pronunciation engine.
- Fonts supporting Latin, Tamil, and Devanagari (e.g. system fonts or extensive Google Fonts) are utilized.
