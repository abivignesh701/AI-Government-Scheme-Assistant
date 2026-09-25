# Central Government Health Scheme (CGHS)

## Overview
India's oldest ongoing central health scheme, started in 1954 in Delhi, providing comprehensive OPD and hospitalization care to serving/retired Central Government employees and specified other categories, in notified CGHS-covered cities. Administered as a Central Sector Scheme under the Ministry of Health and Family Welfare.

## Who Can Qualify
- Central Government employees paid from Central Civil Estimates (except Railways and Delhi Administration) and their dependants, residing in a CGHS-covered city.
- Central Government pensioners (except Railways and Armed Forces pensioners) and their families.
- MPs, ex-MPs, ex-Governors/Lt. Governors, Freedom Fighters, ex-Vice Presidents, sitting/retired Supreme Court judges, retired High Court judges, PIB-accredited journalists (Delhi), Delhi Police personnel (Delhi only), Railway Board employees, and certain autonomous/statutory body staff.

## Eligibility Rules
- **R_CGHS_001** (`cghs_eligible_category` in `['central_govt_employee_civil_estimates', 'central_govt_pensioner_civil_estimates', 'cpf_retiree_and_family', 'widow_of_pensioner_receiving_family_pension', 'member_of_parliament_sitting', 'member_of_parliament_ex', 'governor_or_lt_governor_ex', 'freedom_fighter', 'vice_president_ex', 'supreme_court_judge_sitting_or_retired', 'high_court_judge_retired', 'autonomous_statutory_body_staff_extended_cghs_delhi', 'pib_accredited_journalist_delhi', 'delhi_police_personnel_in_delhi', 'railway_board_employee', 'central_govt_servant_absorbed_in_psu_statutory_or_autonomous_body_with_prorata_pension']`) - Applicant must belong to one of the officially notified categories of persons eligible to join CGHS. *[Verification: VERIFIED; source: SRC004]*
- **R_CGHS_002** (`residence_city_cghs_covered` in `['Delhi_NCR', 'Mumbai', 'Allahabad_Prayagraj', 'Kanpur', 'Kolkata', 'Ranchi', 'Nagpur', 'Chennai', 'Patna', 'Bengaluru', 'Hyderabad', 'Meerut', 'Jaipur', 'Lucknow', 'Pune', 'Ahmedabad', 'Bhubaneswar', 'Jabalpur', 'Guwahati', 'Thiruvananthapuram', 'Bhopal', 'Chandigarh', 'Shillong', 'Dehradun', 'Jammu', 'Gandhinagar']`) - Eligibility for CGHS medical facilities is determined by the beneficiary's place of RESIDENCE being in a CGHS-notified/covered city, not by the employee's official duty headquarters. This list reflects cities notified as of the 2015-16 Annual Report; more cities have reportedly been added since (see uncertain_information). *[Verification: NEEDS_VERIFICATION; source: SRC004]*

## Benefits
- OPD treatment and medicine issue at CGHS Wellness Centres. *[VERIFIED, source: SRC004]*
- Specialist consultation at government hospitals, and at CGHS empanelled hospitals after referral. *[VERIFIED, source: SRC004]*
- Hospitalization (indoor treatment) at government and CGHS-empanelled private hospitals. *[VERIFIED, source: SRC004]*
- Investigations/diagnostics at government and empanelled diagnostic centres. *[VERIFIED, source: SRC004]*
- Reimbursement for hearing aids, artificial limbs, and similar appliances/implants as per CGHS ceiling rates and guidelines. *[VERIFIED, source: SRC004]*
- Coverage across Allopathic, Homoeopathic, and Indian systems of medicine (Ayurveda, Unani, Siddha, Yoga/AYUSH). *[VERIFIED, source: SRC004]*
- In emergencies, beneficiaries may go to any hospital (empanelled or not) and later claim reimbursement for treatment at private unrecognized hospitals under emergency conditions. *[VERIFIED, source: SRC004]*

## Documents
- **Photograph (applicant and dependents)** - Identity record for CGHS card. (Mandatory: True) *[NEEDS_VERIFICATION, source: SRC004]*
- **Proof of residence** - To confirm residence in a CGHS-covered city, which determines eligibility. (Mandatory: True) *[NEEDS_VERIFICATION, source: SRC008]*
- **Proof of dependents** - To register eligible dependent family members. (Mandatory: False) *[NEEDS_VERIFICATION, source: SRC008]*
- **Pension Payment Order (PPO) or provisional PPO / Last Pay Certificate** - Proof of pensioner status for retired employees. (Mandatory: True) *[NEEDS_VERIFICATION, source: SRC008]*

## Application Process
1. **Confirm eligibility category and residence** - Confirm you fall into a notified CGHS-eligible category and reside in a CGHS-covered city.
2. **Fill application at official portal** - Fill the CGHS card application at the official portal.
3. **Submit printed application with documents at Wellness Centre** - Print the completed application and submit it, with supporting documents, at a CGHS Wellness Centre (open Monday-Saturday, typically 7:30 AM-2:00 PM, closed on Central Government holidays) for verification.

- Official application URL: https://cghs.mohfw.gov.in/
- Official helpline: NOT_CONFIRMED_FROM_PRIMARY_SOURCE_IN_THIS_PASS

## Important Restrictions
- **Residence determines eligibility, not duty headquarters.** A Central Government employee working in a CGHS city but living outside it is NOT covered, and vice versa.
- Coverage is limited to NOTIFIED CITIES only - it is not a nationwide scheme in the way PM-JAY is.

## Official Sources
- SRC004: https://main.mohfw.gov.in/sites/default/files/11526324587963256475.pdf (MoHFW Annual Report 2015-16, Chapter 11) - **this is the primary source for the eligible-category list and confirmed the same list is echoed in a separate official DoT circular and a later (2017-18) MoHFW Annual Report chapter found during research, suggesting the CATEGORY list itself is stable.**
- SRC008: https://cghs.mohfw.gov.in/ (current official portal - could NOT be automatically fetched in this research pass due to robots.txt restrictions; flagged for manual verification).

## Uncertainties
- **The list of CGHS-covered cities used here (~25-26 cities) is from a 2015-16 source and is CONFIRMED OUTDATED.** A secondary, unverified source claims ~80 cities and ~42 lakh beneficiaries as of 2026.
- CGHS subscription/contribution rates found in the primary source are from 2009 (post-6th Pay Commission) and are almost certainly outdated; not included as an eligibility rule for this reason, only referenced for transparency.
- No official CGHS helpline number could be confirmed from a primary source in this research pass.

## Conflicting Information
See `sources/conflicts.json` -> CONFLICT_003.

## Notes for Developers
- **HIGH PRIORITY before production use:** manually refresh the city list (R_CGHS_002) against cghs.mohfw.gov.in. A "FAIL" on this rule should be surfaced to the user as "not on our (possibly outdated) list - please check the official CGHS city list" rather than a hard rejection.
- The category list (R_CGHS_001) is comparatively more stable/trustworthy than the city list.
