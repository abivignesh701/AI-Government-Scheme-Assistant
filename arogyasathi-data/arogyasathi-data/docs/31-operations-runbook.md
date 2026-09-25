# Operations Runbook

## Health Checks
- **Liveness**: Route `/api/v1/health` provides base operational status. Expected `200 OK`.
- **Readiness**: Route `/api/v1/ready` checks simulated underlying databases and configurations.
- Alerting systems should target `/api/v1/ready` to remove traffic from malfunctioning pods.

## Logging
- Logs are strictly JSON formatted via `logger.ts`. PII is redacted automatically. Look for `"level":"error"` within aggregated logging sinks.

## Provider Outage Handling
- **LLM/RAG Outage**: The RAG subsystem gracefully handles `500`s from Gemini by resolving static chunk metadata. Do not panic; Deterministic Eligibility is active.
- **Database Outage**: Currently mock database resides in-memory; in a production setting with a SQL database, the Next.js API gracefully fails back, but Eligibility Engine schemas (shipped statically) will remain operational.

## RAG Rebuild
1. Admin triggers a source approval via Dashboard.
2. An Audit Log event `ACTIVATED_VERSION` fires.
3. The underlying pipeline scripts `node scripts/rebuild-rag-index.js`.
4. Monitor logs for `[RAG_INDEX_SUCCESS]`.
