# Security & Privacy Audit

## Current State
- **Secrets**: `SECRET_MISSING` (No `.env` file or hardcoded secrets found, as there is no codebase).
- **Authentication**: `NOT_IMPLEMENTED`.
- **Citizen PII**: The design avoids collecting unnecessary personal information, which is a strong starting point.

## Privacy Recommendations
- Do not store citizen profiles in plain text.
- Rely on session-based ephemeral evaluations where possible.
