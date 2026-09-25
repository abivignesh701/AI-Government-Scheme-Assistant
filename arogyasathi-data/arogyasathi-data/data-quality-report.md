# Data Quality Report - ArogyaSathi Knowledge Base

**Generated:** 2026-09-25

## Summary
- **Total schemes:** 5
- **Total eligibility rules (all schemes):** 18
- **Rules marked VERIFIED:** 14
- **Rules marked NEEDS_VERIFICATION:** 4
- **Total sources registered:** 10
- **Total logged conflicts:** 5
- **Automated validation errors found:** 0

## Rules Table

| Scheme | Rules | Verified | Needs Verification | Distinct Sources Used |
|--------|-------|----------|---------------------|------------------------|
| PMJAY | 4 | 4 | 0 | 1 |
| VAYVANDANA | 4 | 4 | 0 | 2 |
| CGHS | 2 | 1 | 1 | 1 |
| ESIC | 4 | 3 | 1 | 2 |
| CMCHIS | 4 | 2 | 2 | 2 |

## Schemes Suitable for Deterministic (fully automatable) Matching
- PMJAY
- VAYVANDANA

Note: "Suitable for deterministic matching" here means every REQUIRED rule for that scheme is currently
marked VERIFIED. It does NOT mean the scheme has no uncertainties at all - see each scheme's `NOT required`
rules and its `research/<scheme>.md` "Uncertainties" section for caveats even on schemes listed above.

## Schemes Requiring External/Manual Verification Before Production Use
- **CMCHIS** - core income-ceiling rule (R_CMCHIS_003) is NEEDS_VERIFICATION with two conflicting candidate
  values; cannot be safely automated until resolved against a primary Tamil Nadu source.
- **CGHS** - city-coverage rule (R_CGHS_002) is NEEDS_VERIFICATION (source is a 2015-16 city list, likely
  incomplete for 2026-09-25).
- **PMJAY** - requires external database verification (beneficiary.nha.gov.in) by design; no amount of
  local rule logic can fully replace this for a final determination.

## Conflicting Rules
5 unresolved conflicts logged in `sources/conflicts.json`:
- CONFLICT_001 (CMCHIS): Annual household income ceiling for CMCHIS eligibility
- CONFLICT_002 (CMCHIS): Nodal department and income-ceiling exception for differently-abled persons
- CONFLICT_003 (CGHS): Number and list of CGHS-covered (notified) cities
- CONFLICT_004 (ESIC): Minimum number of employees required for an establishment to be covered under ESI
- CONFLICT_005 (VAYVANDANA): Total number of medical/surgical procedures covered under the 70+ expansion

## Outdated Sources
- **SRC004** (MoHFW Annual Report 2015-16) - used for CGHS eligibility categories and city list. The
  CATEGORY list appears stable across multiple official documents spanning 2015-2018, but the CITY list and
  subscription-rate table are confirmed outdated and should not be trusted for current operational use.

## Missing Information (fields we could not populate from an authoritative source)
- CGHS: official current helpline number, exhaustive individual-applicant document checklist, current
  subscription/contribution rates.
- ESIC: individual-employee document checklist beyond employer-side registration documents.
- CMCHIS: the scheme's own official portal URL (a commonly-cited URL could not be independently confirmed
  as live/authoritative), a confirmed nodal department, and the correct income ceiling figure.
- PM-JAY / Vay Vandana: exact, currently-in-force procedure/package counts (these are periodically revised
  and any specific number should be treated as approximate).

## Final Validation Checklist Results
- [x] All JSON files valid (22 files checked)
- [x] No duplicate scheme_ids
- [x] No duplicate rule_ids (18 rule_ids checked, all unique: True)
- [x] Every referenced source_id exists in the source registry
- [x] Every test case references a real scheme_id/rule_id
- [x] Every scheme has at least one primary_source_id
- [x] Tamil and Hindi translation JSON files are valid JSON (confirmed via bulk JSON validation pass above)
- [x] No fabricated URLs - every URL in `sources/source_registry.json` was directly retrieved via web search/fetch during this research session; portal URLs that could not be independently content-verified (CGHS, ESIC, CMCHIS official portals) are explicitly labelled `PRIMARY_EXISTENCE_ONLY` / flagged NEEDS_VERIFICATION rather than presented as confirmed.

**Automated validation errors detected in this run: 0**
(none)
