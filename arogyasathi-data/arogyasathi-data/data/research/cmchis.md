# Chief Minister's Comprehensive Health Insurance Scheme (CMCHIS) - Tamil Nadu

## Overview
Tamil Nadu's flagship state health insurance scheme (formerly Kalaignar Kaappittu Thittam), launched 23 July 2009, providing cashless treatment to economically weaker households through empanelled government and private hospitals. Currently implemented (2022-2027 cycle) via United India Insurance Company under the Tamil Nadu Health Systems Project.

## Who Can Qualify
- Tamil Nadu residents whose name appears on a family/ration card.
- Household annual income below a ceiling - **the exact figure is UNRESOLVED between sources** (see Conflicting Information below).
- Certain special categories (differently-abled persons, transgender persons, journalists, Sri Lankan Tamil refugees, orphaned/rescued children) may have an alternate eligibility path, possibly without the income ceiling for at least the differently-abled-persons category - also unresolved.

## Eligibility Rules
- **R_CMCHIS_001** (`state_of_residence` equals `Tamil Nadu`) - Applicant must be a resident of Tamil Nadu. *[Verification: VERIFIED; source: SRC006]*
- **R_CMCHIS_002** (`name_on_family_ration_card` equals `True`) - The applicant's name must be present on the family/ration card used for household verification. *[Verification: VERIFIED; source: SRC006]*
- **R_CMCHIS_003** (`annual_family_income` less_than_or_equal `None` INR_per_year) - CONFLICTING FIGURES FOUND ACROSS SOURCES: household annual income must be below a stated ceiling, reported as EITHER approximately Rs. 72,000/year OR approximately Rs. 1,20,000/year depending on the (non-primary) source consulted. NEITHER figure could be confirmed against an official Tamil Nadu Government Order or the scheme's own portal in this research pass. The numeric 'value' field is deliberately left as null so a rule engine does NOT silently apply an unverified threshold. *[Verification: NEEDS_VERIFICATION; source: SRC006]*
- **R_CMCHIS_004** (`special_beneficiary_category` in `['transgender_person', 'differently_abled_person', 'accredited_journalist', 'sri_lankan_tamil_refugee_with_citizenship_proof', 'orphaned_or_rescued_child']`) - Certain notified special categories are reported to be covered under CMCHIS-linked schemes, in some cases without the standard income ceiling (e.g., differently-abled persons per SRC007). This could not be fully cross-verified against a single authoritative Tamil Nadu government source and may represent a distinct sub-scheme rather than a blanket exception within core CMCHIS. *[Verification: NEEDS_VERIFICATION; source: SRC007]*

## Benefits
- Cashless family-floater health insurance cover of Rs. 5,00,000 per family per year at empanelled government and private hospitals in Tamil Nadu, for the current 2022-2027 implementation cycle. *[NEEDS_VERIFICATION, source: SRC006]*
- Covers surgeries, follow-up treatments, and diagnostic procedures - reported as approximately 1,090 procedures, 8 follow-up procedures, and 52 diagnostic procedures as of a January 2022 reference point. *[NEEDS_VERIFICATION, source: SRC006]*
- A proposed enhancement of coverage to Rs. 25,00,000 per family has been publicly announced; implementation status (in force vs. pending official guidelines) is unconfirmed. *[NEEDS_VERIFICATION, source: SRC006]*

## Documents
- **Self-declaration by head of family** - Declares household composition and eligibility basis. (Mandatory: True) *[NEEDS_VERIFICATION, source: SRC006]*
- **Ration Card / Family Card** - Proof that the applicant's name is part of an eligible household. (Mandatory: True) *[NEEDS_VERIFICATION, source: SRC006]*
- **Income Certificate (issued by Village Administrative Officer / Revenue authorities)** - To verify the household falls within the (currently unverified) income ceiling. (Mandatory: True) *[NEEDS_VERIFICATION, source: SRC006]*
- **Aadhaar Card** - Identity verification. (Mandatory: True) *[NEEDS_VERIFICATION, source: SRC006]*

## Application Process
1. **Obtain income certificate** - Obtain an income certificate from the Village Administrative Officer (VAO) or Revenue authorities.
2. **Gather documents and visit enrolment centre** - Gather Aadhaar card, ration/family card, and income certificate, then visit the designated enrolment centre.
3. **Verification and biometric capture** - Present documents for verification; complete fingerprint and eye scan and have a photograph taken.
4. **Receive CMCHIS e-card** - Once verified, the CMCHIS e-card is issued.

- Official application URL: NOT_CONFIRMED - commonly cited as cmchistn.gov.in but this could not be independently verified as live/authoritative in this research pass
- Official helpline: Reported Tamil-language toll-free support line and contact emails (tnhealthinsurance@gmail.com, cmchis@uiic.co.in) - LOW confidence, sourced only from a Government-of-India aggregator, not the scheme's own portal

## Important Restrictions
- This is a STATE scheme - only Tamil Nadu residents are eligible.
- The income ceiling used to gate the primary eligibility path is NOT reliably confirmed - see below.

## Official Sources
- SRC006: https://myscheme.gov.in/schemes/cmchis (myScheme, official Government of India scheme-discovery portal - Level 5 per this project's source hierarchy, used for cross-reference, NOT the scheme-owning department's own portal).
- SRC007: https://myscheme.gov.in/schemes/cmchis-tn (a second, seemingly distinct myScheme listing).
- **The scheme's own presumed official portal (commonly cited as cmchistn.gov.in) could NOT be independently located/verified as live and authoritative in this research pass.** This is the weakest-sourced scheme in this dataset and should be the first candidate for a follow-up research pass.

## Uncertainties
- Nodal department attribution is inconsistent across the two myScheme listings.
- Coverage amount (Rs 5 lakh, confirmed with medium confidence) vs. a publicly announced but unconfirmed Rs 25 lakh enhancement.
- Exact procedure/diagnostic counts are from a January 2022 reference point and are likely outdated.

## Conflicting Information
See `sources/conflicts.json` -> CONFLICT_001 and CONFLICT_002.

## Notes for Developers
- **DO NOT hardcode either Rs 72,000 or Rs 1,20,000 as the income ceiling in a rule engine without further verification** - R_CMCHIS_003.value is deliberately left null in this dataset.
- This scheme needs a dedicated follow-up research pass hitting the actual Tamil Nadu Government scheme portal / a Government Order (G.O.) before it can be considered production-ready for deterministic matching.
