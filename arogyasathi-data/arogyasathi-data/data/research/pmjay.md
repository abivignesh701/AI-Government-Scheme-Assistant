# Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)

## Overview
World's largest government-funded health assurance scheme, providing a Rs 5 lakh per family per year cashless cover for secondary and tertiary hospitalization to the bottom 40% of India's population (~12 crore families, ~55 crore beneficiaries), identified via the Socio-Economic Caste Census (SECC) 2011. Launched 23 September 2018 in Ranchi, Jharkhand. Implemented by the National Health Authority (NHA) with State Health Agencies (SHAs).

## Who Can Qualify
- Rural households meeting at least one SECC 2011 deprivation criterion (D1-D5, D7) or an automatic-inclusion category (destitute, manual scavenger, primitive tribal group, released bonded labourer).
- Urban households where a member works in one of 11 specified occupational categories (ragpicker, domestic worker, street vendor, construction labourer, sweeper, home-based artisan, transport worker, shop helper, electrician/mechanic, washerman/chowkidar, etc.)
- Families previously covered under the erstwhile Rashtriya Swasthya Bima Yojana (RSBY) but not present in SECC 2011.

## Eligibility Rules
- **R_PMJAY_001** (`beneficiary_database_status` database_match `True`) - The applicant's household must appear in the SECC 2011 (or subsumed RSBY) PM-JAY beneficiary database, identified via rural deprivation criteria or urban occupational category. *[Verification: VERIFIED; source: SRC001]*
- **R_PMJAY_002** (`urban_occupation_category` in `['ragpicker', 'beggar', 'domestic_worker', 'street_vendor_cobbler_hawker', 'construction_plumber_mason_labour_painter_welder_security_guard_coolie', 'sweeper_sanitation_worker_mali', 'home_based_artisan_handicrafts_tailor', 'transport_worker_driver_conductor_helper_cart_puller_rickshaw_puller', 'shop_worker_assistant_peon_helper_delivery_attendant_waiter', 'electrician_mechanic_assembler_repair_worker', 'washerman_chowkidar']`) - For urban households, membership in one of the 11 officially listed occupational categories is one recognised path to SECC 2011-based inclusion. *[Verification: VERIFIED; source: SRC001]*
- **R_PMJAY_003** (`rural_deprivation_criteria_met` in `['D1_one_room_kucha_house', 'D2_no_adult_member_16_59', 'D3_no_adult_male_member_16_59', 'D4_disabled_member_no_able_bodied_adult', 'D5_sc_st_household', 'D7_landless_manual_casual_labour', 'automatic_inclusion_destitute_or_alms', 'automatic_inclusion_manual_scavenger', 'automatic_inclusion_primitive_tribal_group', 'automatic_inclusion_released_bonded_labour']`) - For rural households, meeting at least one SECC 2011 deprivation criterion (D1-D5, D7) or an automatic-inclusion category is one recognised path to inclusion. *[Verification: VERIFIED; source: SRC001]*
- **R_PMJAY_004** (`family_size` requires_verification `NO_CAP` members) - There is no restriction on family size for benefit eligibility once a household is included - the Rs 5 lakh cover is a family floater with no member limit (unlike the old RSBY, which capped at 5 members). *[Verification: VERIFIED; source: SRC001]*

## Benefits
- Cashless family-floater health cover of Rs. 5,00,000 per family per year for secondary and tertiary care hospitalization at empanelled public and private hospitals across India. *[VERIFIED, source: SRC001]*
- Covers 3 days of pre-hospitalization and 15 days of post-hospitalization expenses including diagnostics and medicines. *[VERIFIED, source: SRC001]*
- No restriction on family size, age, or gender; benefit is a family floater. *[VERIFIED, source: SRC001]*
- All pre-existing diseases are covered from day one of enrolment, with no waiting period. *[VERIFIED, source: SRC001]*
- Benefits are portable nationwide - a beneficiary can use any empanelled hospital in any state, not only their home state. *[VERIFIED, source: SRC001]*
- Approximately 1,929 treatment packages (per nha.gov.in) across roughly 24 medical specialities are covered; exact current package count is periodically revised (HBP versions) and should be reconfirmed. *[NEEDS_VERIFICATION, source: SRC001]*

## Documents
- **Aadhaar Card** - Identity verification and e-KYC for card generation. (Mandatory: True) *[NEEDS_VERIFICATION, source: SRC001]*
- **Ration Card / Family ID** - Household identification for matching against the SECC 2011 database. (Mandatory: False) *[NEEDS_VERIFICATION, source: SRC001]*

## Application Process
1. **Check database inclusion** - Search the Beneficiary Identification System at beneficiary.nha.gov.in or mera.pmjay.gov.in using mobile number, Aadhaar, or ration card to see if the household is in the SECC 2011/RSBY database.
2. **Complete e-KYC** - If included, complete Aadhaar-based (or non-Aadhaar) e-KYC to generate the Ayushman Card.
3. **Assisted registration (if needed)** - Visit a Common Service Centre (CSC) or an empanelled hospital's Ayushman Mitra help desk for assisted verification and card generation.

- Official application URL: https://beneficiary.nha.gov.in
- Official helpline: 14555 or 1800-111-565 (24x7 National Call Centre)

## Important Restrictions
- This is an entitlement-based scheme keyed to a pre-existing government database, NOT a scheme you can freely "apply" to based on stated income/occupation alone. Any tool built on this data must present pre-screen results as "likely eligible, please confirm" rather than a guaranteed PASS.
- No age, gender, or family-size restriction once a household is included.

## Official Sources
- SRC001: https://nha.gov.in/PM-JAY (National Health Authority - official scheme page)
- SRC010: https://beneficiary.nha.gov.in (official beneficiary check/e-KYC portal)

## Uncertainties
- The total number of currently covered treatment packages varies across official/near-official statements over time (see conflicts.json CONFLICT_005-adjacent figures) and should be reconfirmed against the live Health Benefit Package (HBP) list.
- Current participation status of Delhi and West Bengal should be reconfirmed as of today's date.

## Conflicting Information
See `sources/conflicts.json` -> CONFLICT_005 (procedure count, shared with the Vay Vandana expansion).

## Notes for Developers
- Treat `beneficiary_database_status` as the single source of truth; occupation/rural-criteria fields are pre-screening heuristics only, not final determinants.
- Do not build a numeric income-threshold rule for this scheme - none exists; SECC 2011 categorisation is the mechanism.
