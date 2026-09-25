# Module 9: Multilingual System, Translation Integrity & Locale-Aware UX

## Overview
Module 9 transforms ArogyaSathi into a fully multilingual platform supporting English (`en`), Tamil (`ta`), and Hindi (`hi`). This localization operates strictly at the presentation layer; canonical data and business logic rules (such as eligibility logic and financial thresholds) remain language-independent. This ensures the integrity of the government rules across all language interfaces.

## Translation Architecture
We implemented a robust Context-based localization system designed for Next.js App Router without requiring a full structural routing rewrite (e.g., prefixing `/[lang]/...`).
- **I18nProvider**: Injects global translation functions (`t`) and tracks current language state across all client components.
- **Persistent State**: The chosen locale is synced to `localStorage`, allowing users to traverse eligibility wizards and RAG chats without losing their session context upon reload or route changes.
- **Key-Value Maps**: Translations are safely maintained in JSON maps mapping standard semantic keys (e.g., `eligibility.reason.INCOME_WITHIN_LIMIT`).

## Fallback Policy
If a specific component or term does not exist in Tamil/Hindi, the `t(key)` function gracefully falls back to English, and ultimately to the raw key, preventing empty UI elements.

## Glossary & Official Terminology
A `glossary.json` has been introduced containing unified semantic mappings of government terms (e.g., "Empanelled Hospital", "Income Certificate"). This ensures that translators and components use consistent nomenclature rather than fragmented terminology across different pages.

## Locale-Aware Formatting
- **Currency**: `Intl.NumberFormat` enforces strict `en-IN` formatting (`₹1,00,000`) regardless of the user's selected language, as numerical meaning must never change.
- **Dates**: `Intl.DateTimeFormat` ensures consistent chronological presentation.

## Validation Script
A dedicated Node script (`scripts/validate_translations.ts`) runs an exhaustive parity check on the JSON dictionaries. It verifies:
- Key Parity: Ensures Tamil and Hindi contain exactly the same keys as English.
- Placeholder Parity: Uses regex mapping to ensure dynamic interpolation fragments (e.g., `{limit}`) are not missed or mistyped in the translated strings, preventing runtime reference errors.

## RAG Translation Capabilities
Since RAG uses a semantic matching algorithm through embedding models, natural language processing handles Tamil and Hindi inputs natively without needing to hard-code deterministic search paths for every language. RAG natively processes transliterations (e.g., "maruthuva kaapidu") via cross-lingual vector overlap.

## Testing & Automation
The app successfully compiled under the Next.js Turbopack build system post-integration. The automated parity checker exits with a 0-status on the current dictionary set, confirming perfect alignment.
