# Research Summary - ArogyaSathi Knowledge Base

**Date compiled:** 2026-09-25

## Scheme Selection Rationale

1. **Ayushman Bharat PM-JAY (PMJAY)** - Mandated by the project brief. India's largest health assurance scheme, with the strongest single official source (nha.gov.in) of any scheme researched.
2. **Chief Minister's Comprehensive Health Insurance Scheme (CMCHIS)** - Mandated by the project brief. Included despite being the WEAKEST-sourced scheme here, because a state scheme is essential to demonstrate the "state/region" input dimension the eligibility engine must eventually support.
3. **Ayushman Vay Vandana Yojana (VAYVANDANA)** - Chosen because it is a genuinely distinct, cleanly age-gated central scheme (no income test) directly relevant to the "age" input dimension, and because it happens to have the single strongest primary source of the entire dataset (an official Rajya Sabha parliamentary reply, SRC003). It also demonstrates how one "parent" programme (PM-JAY) can contain multiple, differently-gated sub-schemes - an important structural pattern for the eligibility engine to handle.
4. **Central Government Health Scheme (CGHS)** - Chosen to represent the "existing government coverage" and "occupation" input dimensions (central government employment is a common real-world occupation category), and because it has multiple corroborating official MoHFW documents for its core eligibility category list, even though city-level currency is a known weak point.
5. **Employees' State Insurance Scheme (ESIC)** - Chosen to represent the "income bracket" and "occupation" (organised-sector employee) input dimensions with a genuinely computable numeric wage-ceiling rule, backed by the single most RECENT official primary source found in this entire research pass (28 July 2025 Ministry of Labour document).

Together these 5 schemes exercise every core user-input dimension named in the project brief (income/income bracket, occupation, state/region, family size, age, existing health coverage) at least once, with varying degrees of source strength - which is itself instructive for prioritising future verification work.

## Source Hierarchy Actually Achieved (per scheme)

| Scheme | Best source level achieved | Source ID(s) |
|---|---|---|
| PMJAY | Level 1 (official agency page) | SRC001 |
| VAYVANDANA | Level 1 (official parliamentary reply - arguably stronger than Level 1) | SRC003 |
| CGHS | Level 1 (official annual report, but dated 2015-16) | SRC004 |
| ESIC | Level 1 (official ministry document, dated 28 Jul 2025 - most current source in dataset) | SRC005 |
| CMCHIS | Level 5 (myScheme aggregator only - scheme's own portal not confirmed) | SRC006, SRC007 |

## Key Findings
- **Strongest scheme for deterministic rule-engine matching:** Ayushman Vay Vandana Yojana (single clean age gate, explicitly documented as the SOLE criterion by an official parliamentary reply).
- **Weakest scheme for deterministic rule-engine matching:** CMCHIS (Tamil Nadu) - the income ceiling, the single most important gating number, is unresolved between two candidate figures and neither is confirmed against a primary Tamil Nadu government source.
- **Most surprising gap:** the CGHS and ESIC official portals (cghs.mohfw.gov.in, esic.gov.in) both resisted automated verification in this pass (robots.txt block / no reliable deep-link found), even though both schemes are old, well-established, and heavily documented in OTHER official PDFs (Annual Reports, Ministry press releases). This suggests future research passes should prioritise PDF/document search over live portal scraping for these two schemes.
- **5 explicit conflicts** were logged in `sources/conflicts.json`, spanning income ceilings, city lists, employee-count thresholds, and procedure counts - all flagged NEEDS_VERIFICATION rather than silently resolved.

## What Still Needs Research (Not Done In This Pass)
- CMCHIS's actual owning-department portal and a Tamil Nadu Government Order confirming the income ceiling.
- A current (2026) CGHS city list from cghs.mohfw.gov.in.
- State-wise ESIC establishment-size threshold confirmation.
- Any additional state schemes (Rajasthan, Karnataka, Maharashtra, West Bengal, Delhi, etc.) - deliberately out of scope for this pass, listed in `schemes/` only as an absence, not fabricated.

## Methodology Note
All facts in this knowledge base were sourced via live web search and direct document/page fetches performed on 2026-09-25. Where automated fetching of an official portal was blocked (CGHS) or a canonical scheme portal could not be confidently located (CMCHIS), this is explicitly disclosed in the relevant scheme's `verification_status` fields and in `research/{scheme}.md`, rather than silently substituting a secondary source as if it were primary.
