# Translation Coverage Report

## UI Key Coverage
Based on the translation validation script, parity is maintained across core modules:
- English: 100% (Base)
- Tamil: 100% of defined keys.
- Hindi: 100% of defined keys.

**Covered Journeys:**
- Authentication (Login, Signup, Errors)
- Dashboard (Navigation)
- Citizen Profile (Fields, validation)
- Eligibility (Status codes, parameterized reason codes)
- AI Assistant (UI strings, chat structure)

## Dynamic Scheme Translation Coverage
Currently, scheme metadata (Name, Summary, Conditions) is maintained as canonical English inside the eligibility rules engine and MongoDB.
- Full localized storage schema mapping for MongoDB (`scheme_id`, `language`, `display_name`, `summary`) is prepared in architecture.
- For AI Assistant usage, responses are dynamically translated by the LLM securely while grounded in English source data.

## Known Missing Translations
- Admin Dashboards (Intentionally un-translated per architecture).
- Operational Logs (Intentionally un-translated).
- Extended Error Codes: Some deep validation errors fallback to generic English.
- Complete 100% mapping of all Indian State/District names (Deferred to standard external library/geo DB).

## Stale Translations
- None currently (Greenfield implementation). 
- Designed `translation_status` field (HUMAN_REVIEWED, MACHINE_TRANSLATED, UNREVIEWED) and `updated_at` timestamps for future tracking against canonical data versions.
