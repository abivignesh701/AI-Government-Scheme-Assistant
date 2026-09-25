# Module 13: Observability & Reliability

## Structured Logging
All subsystems use a unified `logger.ts` interface exporting events with standard formats:
`{ timestamp, level, event, ...meta }`

## PII Redaction
The logger safely runs regex heuristics mapping sensitive numeric clusters (Aadhaar, Phone Numbers) into explicit `[REDACTED]` markers before piping into `stdout`.

## Health & Readiness Endpoints
- **Liveness**: `/api/v1/health` checks immediate operational viability of the process.
- **Readiness**: `/api/v1/ready` tracks underlying connections (simulated DB connectivity and RAG readiness).

## Graceful Degradation
- **STT/TTS Voice**: If the STT provider returns errors or payload size exceeds limits, the system throws `503` explicitly guiding the frontend to fallback onto native Browser Web Speech APIs.
- **RAG Subsystem**: If Gemini is unreachable or RAG errors occur, the assistant resolves with safe offline fallback context chunks natively, preserving baseline information access.
- **Eligibility Engine**: Operates locally via deterministic JSON checks ensuring uptime independently of RAG or Voice service health.
