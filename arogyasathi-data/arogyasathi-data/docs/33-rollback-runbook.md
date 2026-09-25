# Rollback Runbook

## Application Rollback
If a deployment fails the automated Post-Deploy Smoke Test, the CD pipeline aborts and the orchestration platform (e.g. Kubernetes/Vercel) automatically reverts to the prior replica/artifact.

### Manual App Rollback
Use GitHub Actions -> Actions -> Deploy Production -> Select previous successful run -> Re-run jobs.

## Knowledge / RAG Rollback
If an Admin accidentally publishes incorrect Government Schemes:
1. Access `/admin/audit`.
2. Note the prior `KnowledgeVersion` ID.
3. Select `Rollback` in the UI (Triggering `AdminDB.updateVersion` backward pointer).
4. The backend automatically repoints Eligibility routing to the prior Scheme version.
5. RAG re-indexes the reverted canonical facts.
