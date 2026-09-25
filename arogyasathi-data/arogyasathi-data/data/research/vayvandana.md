# Ayushman Vay Vandana Yojana (AB PM-JAY expansion for senior citizens 70+)

## Overview
A universal, income-agnostic expansion of AB PM-JAY, launched 29 October 2024, covering all Indian citizens aged 70 and above regardless of socio-economic status. Provides Rs 5 lakh/year cover, or an additional Rs 5 lakh/year top-up for families already covered under core PM-JAY.

## Who Can Qualify
Any Indian citizen aged 70 years or above, verified via Aadhaar. No income, occupation, or social-category test applies.

## Eligibility Rules
- **R_VAY_001** (`age` greater_than_or_equal `70` years) - Applicant must be 70 years of age or above, as recorded in Aadhaar. This is stated in the official parliamentary reply as the SOLE eligibility criterion for this scheme. *[Verification: VERIFIED; source: SRC003]*
- **R_VAY_002** (`aadhaar_ekyc_completed` equals `True`) - Aadhaar-based e-KYC is mandatory for enrolment and issuance of the Ayushman Vay Vandana card. *[Verification: VERIFIED; source: SRC003]*
- **R_VAY_003** (`existing_other_govt_health_scheme` requires_verification `['CGHS', 'ECHS', 'Ayushman_CAPF']`) - If the senior citizen already holds coverage under CGHS, ECHS, or Ayushman CAPF, they must make a ONE-TIME CHOICE between that existing scheme and AB-PMJAY (Vay Vandana) - they cannot hold both simultaneously. This is a choice condition, not a blanket exclusion. *[Verification: VERIFIED; source: SRC003]*
- **R_VAY_004** (`existing_private_insurance_or_esi` not_equals `BLOCKING`) - Holding active private health insurance or Employees' State Insurance (ESI) coverage does NOT disqualify a senior citizen from also availing AB-PMJAY (Vay Vandana) benefits. *[Verification: VERIFIED; source: SRC002]*

## Benefits
- Rs. 5,00,000 per year free health cover for the senior citizen (70+), irrespective of socio-economic status. *[VERIFIED, source: SRC002]*
- If the senior citizen's family is already a PM-JAY beneficiary family, an ADDITIONAL top-up of up to Rs. 5,00,000/year is provided exclusively for the 70+ member(s), separate from and not shared with the family's existing PM-JAY cover. *[VERIFIED, source: SRC002]*
- Coverage for approximately 1,900-2,000+ medical/surgical procedures across roughly 27 specialities per government press statements (exact figure varies slightly by source/date). *[NEEDS_VERIFICATION, source: SRC002]*

## Documents
- **Aadhaar Card** - Mandatory age verification (70+) and e-KYC for enrolment and card issuance. (Mandatory: True) *[VERIFIED, source: SRC003]*

## Application Process
1. **Confirm age 70+** - Confirm the senior citizen's age is 70 or above as recorded in Aadhaar.
2. **Complete Aadhaar e-KYC** - Complete mandatory Aadhaar-based e-KYC via the Ayushman App or beneficiary.nha.gov.in, or with assistance at a CSC/empanelled hospital.
3. **Choose scheme if already covered elsewhere** - If already covered under CGHS/ECHS/Ayushman CAPF, make the required one-time choice between the existing scheme and AB-PMJAY during enrolment.
4. **Receive Ayushman Vay Vandana card** - Once verification is complete, the Ayushman Vay Vandana card is issued.

- Official application URL: https://beneficiary.nha.gov.in ; https://pmjay.gov.in
- Official helpline: 14555 (general PM-JAY helpline); 1800-11-0770 (reported Vay Vandana support line - LOW confidence, unverified against a primary source)

## Important Restrictions
- Holders of CGHS/ECHS/Ayushman CAPF must make a ONE-TIME CHOICE between their existing scheme and this one - cannot hold both.
- Private insurance and ESI holders remain eligible for this scheme in ADDITION to their existing cover (no conflict).

## Official Sources
- SRC002: https://mohfw.gov.in/press-info/7914 (MoHFW press release)
- SRC003: https://rsdebate.nic.in/bitstream/123456789/758871/1/PQ_267_11022025_U903_p367_p370.pdf (Rajya Sabha Unstarred Question No. 267, 11 Feb 2025) - **this is the single strongest source found in this research pass, being an official Government of India parliamentary reply.**

## Uncertainties
- Exact current procedure count (~1929 vs ~1961 vs ~2000 across different official/near-official statements).
- Current (2026) participation status of Delhi and West Bengal.

## Conflicting Information
See `sources/conflicts.json` -> CONFLICT_005.

## Notes for Developers
- This is the CLEANEST scheme in this dataset from a rule-engine perspective: essentially a single hard gate (age >= 70) plus a procedural step (e-KYC).
- Do NOT gate on income for this scheme - explicitly none exists.
