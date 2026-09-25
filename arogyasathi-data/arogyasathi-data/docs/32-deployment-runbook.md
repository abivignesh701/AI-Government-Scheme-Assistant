# Deployment Runbook

## Staging Deployment
1. Merges to `main` auto-trigger `ci.yml`.
2. Push tags `v*.*.*` trigger `cd.yml`.
3. Staging builds the standalone Next.js docker image:
   `docker build -t arogyasathi-web:staging .`
4. Deploys to Staging infrastructure mapping test secrets.

## Production Promotion
1. QA reviews Staging UAT criteria.
2. Admin explicitly approves the deployment in GitHub Environments.
3. The CD pipeline runs the automated Database Backup.
4. Docker artifact `arogyasathi-web:prod` rolls out via blue/green deployment strategy.
5. Automated smoke test curls `/api/v1/ready`.
