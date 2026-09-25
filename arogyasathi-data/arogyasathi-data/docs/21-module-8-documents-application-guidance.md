# Module 8: Documents, Application Guidance & Citizen Action Support

## Overview
Module 8 transforms ArogyaSathi from a purely informational tool into an actionable guide. It generates deterministic action plans and personalized document checklists to direct citizens to official verified enrollment channels based on their exact eligibility statuses. The system never pretends to "approve" applications on behalf of the government.

## Action Plan Service
The `GuidanceService` uses the `EligibilityService` underneath to dynamically compute an `ActionPlan`.
Depending on the `status` of the evaluation:
- **MATCH**: Prioritizes "Prepare Required Documents" and "Enroll via Official Channel" (providing verified external links).
- **NEEDS_VERIFICATION**: Prioritizes "Verify Officially" and notes that standard rules couldn't definitively match (usually due to database lookup requirements).
- **NOT_MATCHED**: Safely advises the citizen to "Review Why You Did Not Match" and "Update Profile", completely avoiding redirecting them to application portals where they will be rejected.
- **UNKNOWN**: Encourages the citizen to "Check Eligibility" first.

## Document Guidance Architecture
The document checklist operates on strict explicit conditions mapping exactly to the schema:
- Parses `documents` from `master/schemes.json`.
- Enforces strict differentiation between `REQUIRED` and `CONDITIONALLY_REQUIRED` documents.
- Stores local temporary "checklist state" in the frontend (`I have this`, `I need to get this`) to assist citizens without persistently logging sensitive data to a backend database.

## Application Guidance Architecture
- Renders application paths dynamically based on the verified canonical `channels` (e.g., online portals).
- Explicitly flags application destinations as "Official".

## Contextual RAG Integration
A contextual assistant drawer is present on the guidance view. It is hard-injected with the `scheme_id` to provide focused assistance regarding:
- Document definitions (e.g., "What is an income certificate?")
- Application terminology (e.g., "What is a CSC?")
All responses remain completely within the verified bounds of the canonical knowledge base chunks.

## Printable View
The `/schemes/[id]/guidance` page provides a native, stripped-down print layout out-of-the-box (`window.print()`). All heavy UI elements, sidebars, sticky headers, and AI tools are styled with `print:hidden`, providing citizens (and CSC helpers) with a clean, ink-saving paper checklist to carry to offline enrollment offices.

## Endpoints
- `POST /api/v1/guidance/action-plan`: Connects the guidance frontend to the deterministic eligibility/guidance core. Accepts `scheme_id` and optional `profile` data.
