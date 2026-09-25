# Incident Response Plan

## 1. Eligibility Bug Discovered
- **Symptom**: User complains they were marked NOT MATCHED when they should be MATCHED.
- **Action**: Obtain their inputs. Run the Deterministic engine locally against their input.
- **Resolution**: If engine rule is broken, fix `src/lib/services/evaluateScheme.ts` or correct the canonical JSON scheme document. Rollout a hotfix via CD.

## 2. RAG Hallucination Surge
- **Symptom**: Assistant provides wildly inaccurate cash amounts.
- **Action**: Check `KnowledgeVersion` to ensure Stale data hasn't been merged. Verify prompt constraints in `src/lib/services/rag.ts`.
- **Resolution**: Toggle RAG feature flag off temporarily. App degrades gracefully. Fix prompt/chunking.

## 3. Source Update Failure
- **Symptom**: Health checks in Admin UI all show `UNREACHABLE` suddenly.
- **Action**: Verify SSRF blocklists aren't mistakenly flagging the target TLD. Check DNS routing out of the production cluster.
