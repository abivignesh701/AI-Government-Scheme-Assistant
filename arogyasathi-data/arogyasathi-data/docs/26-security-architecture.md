# Module 13: Security Architecture

## Trust Boundaries
- **Citizen UI**: Fully untrusted. Validated at all API boundaries (`/api/v1/profile/normalize`, `/api/v1/eligibility/evaluate`).
- **Admin UI**: Requires authenticated Context (enforced server-side via NextJS Route Proxy).
- **RAG Subsystem**: Untrusted prompt layer. Hardened via System Instructions against Prompt Injection overriding Deterministic Logic.
- **Source Registry**: Verified internal system. Fetches restricted via SSRF URL Blocklist preventing metadata/intranet scanning.

## Access Control & Auth
- Implemented `middleware.ts` to actively enforce authentication on all `/admin/*` and `/api/v1/admin/*` routes.
- Frontend hiding is discarded in favor of pure server-side cookie/header validation.

## SSRF Defenses
- Source checkers explicitly validate the `URL` hostname object, stripping out `127.0.0.1`, `localhost`, `10.*`, `192.168.*`, and AWS Metadata (`169.254.169.254`) domains.

## XSS & CSP
- Application utilizes React's native HTML escaping across all variables avoiding `dangerouslySetInnerHTML`.
- `middleware.ts` injects strict `Content-Security-Policy` mapping only known safe domains, preventing inline-eval manipulation outside core hydration.

## PII Management
- Application relies purely on localized Ephemeral `localStorage` states rather than server-side persistent profiles.
- Any server-side operations utilizing logs process data through `logger.ts`, sanitizing identifiable heuristics (Aadhaar, Phone Numbers) into `[REDACTED]`.

## Rate Limiting & DoS
- In-memory (Mock Redis) Rate limit intercepts standard pathways ensuring 100 requests / min maximum, throwing HTTP `429` safely.
