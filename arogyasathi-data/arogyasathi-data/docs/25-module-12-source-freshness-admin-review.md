# Module 12: Source Freshness, Government Data Verification & Admin Review Workflow

## Overview
Module 12 introduces a robust data governance layer to ArogyaSathi, transforming the canonical government-scheme knowledge base from statically seeded data into a dynamic, version-controlled, auditable lifecycle.

This ensures that ArogyaSathi's Deterministic Eligibility Engine never makes arbitrary changes to production logic without human oversight.

## Key Features

### 1. Hardened Source Model
- **`SourceStatus`**: Tracks exact states (`ACTIVE`, `BROKEN_SOURCE`, `PENDING_REVIEW`, etc.) preventing 404s from dropping rules entirely.
- **Health Verification**: Admins can force manual updates to specific sources which will validate hash outputs and HTTP reachability via secure NextJS API endpoints.

### 2. Admin Review Workflow
- **Detection**: A system identifies changes (`BENEFIT_CHANGED`, `RULE_TEXT_CHANGED`, etc.) categorizing impact levels (`LOW`, `HIGH`, `CRITICAL`).
- **Diff Review**: Admins log into the `/admin/reviews/[id]` route, observing a precise Before vs After layout mapping.
- **Approval / Rejection**: Approval provisions an explicit `KnowledgeVersion`, recording the event into the append-only `AuditLog`. Rejecting a change requires an explicit reason protecting against silent dismissals.

### 3. Versioning & Rollback Safety
- **Immutable States**: Knowledge rules mutate forward by publishing explicit `KnowledgeVersion` packets (`ver-[timestamp]`). 
- **Consistency**: Activation explicitly logs re-validation triggers, tying new `SourceChanges` directly back to the RAG index, avoiding stale chunk presentation.

### 4. Admin API Matrix
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/admin/sources` | Lists all monitored sources. |
| POST | `/api/v1/admin/sources/[id]/check` | Forces a health ping to a specific source URL. |
| GET | `/api/v1/admin/reviews` | Yields all pending review tickets. |
| POST | `/api/v1/admin/reviews/[id]/approve` | Approves a change, triggers Version creation and triggers RAG re-index simulations. |
| POST | `/api/v1/admin/reviews/[id]/reject` | Rejects a change, requiring a markdown reason. |
| GET | `/api/v1/admin/audit` | Exposes the immutable ledger of Admin events. |

## Implementation
The feature relies on Server-Side APIs acting upon a mocked in-memory store simulating a transactional database (`db.ts`). Admin layouts are protected underneath `src/app/admin/*`, structurally isolated from the core Citizen UI.

## Testing & Compilation
Passed full Turbopack static resolution compilation ensuring types (`Promise<{ id: string }>`) securely map to Next.js 15 App Router standard API params.
