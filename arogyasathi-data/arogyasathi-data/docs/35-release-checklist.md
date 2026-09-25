# Release Checklist

## Before Merging to Main
- [x] Linting passes globally.
- [x] Type checking passes globally.
- [x] All Unit / Integration tests pass.
- [x] Dependencies audited for critical CVEs (`npm audit`).

## Before Tagging a Release
- [x] Ensure Staging Environment matches target production architecture.
- [x] Complete Full UAT smoke test on Staging.
- [x] Verify Knowledge DB compatibility with App Logic.

## During Deployment
- [x] Ensure Manual Approval Gate triggers on GitHub Actions.
- [x] Review Docker Image Build logs.
- [x] Monitor `/api/v1/health` and `/api/v1/ready` probes post-deployment.

## Post-Deployment
- [x] Test production DNS routing (HTTPS).
- [x] Check Sentry / CloudWatch for early 500s.
- [x] Verify Admin Dashboard loads correctly and authenticated access works.
- [x] Fire a single RAG query to ensure vector dimensions match LLM APIs.
