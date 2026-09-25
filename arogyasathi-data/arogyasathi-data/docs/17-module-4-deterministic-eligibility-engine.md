# Module 4: Deterministic Eligibility Engine

## Overview
This module introduces the core Deterministic Eligibility Engine. It ensures that scheme matching is strictly based on rule evaluation against the validated `CitizenProfile`, avoiding any LLM hallucinations regarding eligibility. It evaluates conditions locally and outputs exact reasons for why a scheme matches, fails, or requires official verification.

## Core Features
1. **Canonical Rule Parser**: Dynamically loads JSON rules configured per scheme (e.g. `pmjay_rules.json`, `cmchis_rules.json`).
2. **Deterministic Evaluation**: Implements atomic operators (`EQ`, `NEQ`, `GTE`, `LTE`, `IN`) against the profile without network/database latency.
3. **Three-Valued Logic**:
   - `PASS`: Condition strictly satisfied.
   - `FAIL`: Condition strictly violated.
   - `UNKNOWN`: Missing data, or condition involves `database_match`/`requires_verification`.
4. **Scheme Status Aggregation**:
   - `MATCH`: All mandatory conditions pass.
   - `NOT_MATCHED`: ANY mandatory condition fails (e.g., State mismatch).
   - `NEEDS_VERIFICATION`: ANY mandatory condition is `UNKNOWN`, or an official database check is mandated by the rules.
5. **Traceability**: Each `ConditionResult` output contains the explicit `reason_message` and the `source_id` directly derived from the official data.

## Endpoints
- `POST /api/v1/eligibility/evaluate`: Accepts a validated `CitizenProfile`. Returns an ordered array of `SchemeResult` objects mapped into the `MATCH`, `NEEDS_VERIFICATION`, or `NOT_MATCHED` categories.

## Frontend Results Experience (`/eligibility/results`)
- Renders premium visual cards grouping the outcomes into 3 sections.
- Provides a "Why this result? (Condition Breakdown)" expandable `<details>` section for deep transparency.
- Evaluated missing info (e.g., `NEEDS_VERIFICATION`) gives users an "Edit Profile" Call-To-Action to return and resolve data gaps.

## Known Data Limitations Handled Correctly
- The engine accurately handles `CMCHIS` income limitations being formally marked as `NEEDS_VERIFICATION` in the source data due to conflicting figures (₹72k vs ₹120k).
- `PMJAY` rural/urban flags are processed without triggering hard failures if unspecified, as they rely finally on the `database_match` (SECC 2011).

## Rule Coverage
- **Total Schemes**: 5 (PMJAY, VAYVANDANA, CMCHIS, CGHS, ESIC).
- All 5 schemas are mapped and deterministically evaluatable within this engine using basic operator propagation.
