# Module 3: Citizen Onboarding, Profile Collection & AI-Assisted Normalization

## Overview
This module introduces the citizen onboarding flow, allowing users to build a structured `CitizenProfile` through either guided adaptive forms or natural language text extraction via AI. The core philosophy is that AI extracts and normalizes the information, but never makes eligibility decisions or guesses unknown values.

## Core Features
1. **Multilingual UI**: The onboarding flow is fully translated into English, Tamil, and Hindi. State is managed locally.
2. **Dual-Input Modalities**: 
    - *Natural Language (AI)*: Users can write a paragraph about their situation. The Gemini 2.5 AI extracts structured data strictly adhering to a JSON schema.
    - *Guided Form*: A traditional step-by-step form for precise data entry.
3. **Uncertainty Handling**: Fields can explicitly be marked as `UNKNOWN`. AI is instructed via prompt not to guess or infer values loosely. 
4. **Validation Pipeline**: The backend service checks for negative income, zero family size, and state/district mismatches.

## AI Safeguards
The LLM prompt strictly enforces:
- "Do not guess."
- "Do not infer eligibility."
- "Unknown fields must remain unknown (null)."
Fallback behavior is implemented if the AI provider (Gemini) is unavailable, gracefully returning an empty profile to encourage the user to use the Guided Form.

## Data Schema (`CitizenProfile`)
Every field in the profile is wrapped in a metadata object:
```json
{
  "value": "100000",
  "status": "KNOWN", // or "UNKNOWN", "NOT_PROVIDED"
  "source": "AI_EXTRACTED", // or "USER_FORM"
  "needs_confirmation": true
}
```
This ensures we know exactly where data came from and whether the user has reviewed it.

## Endpoints
- `POST /api/v1/profile/normalize`: Accepts natural language and language preference. Returns structured profile extraction.
- `POST /api/v1/profile/validate`: Validates a provided profile for basic deterministic logic constraints.
