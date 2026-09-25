# Employees' State Insurance Scheme (ESI / ESIC)

## Overview
A statutory, self-financing social security and health insurance scheme under the Employees' State Insurance Act, 1948, covering employees of notified factories/establishments earning within a wage ceiling, funded by employer (3.25%) and employee (0.75%) contributions on gross wages.

## Who Can Qualify
- Employees earning gross monthly wages up to Rs 21,000 (Rs 25,000 if the employee has a disability).
- Employed at a factory/establishment notified under the ESI Act, with 10 or more employees (in most States/UTs; some secondary sources report a 20-employee threshold in a few states - unverified).
- On the employer's payroll (not self-employed/freelance/gig work without an employer relationship - unverified against a primary source, flagged accordingly).

## Eligibility Rules
- **R_ESIC_001** (`monthly_gross_wage` less_than_or_equal `21000` INR_per_month) - Employee's gross monthly wages must not exceed Rs. 21,000/month for standard ESI coverage eligibility (see R_ESIC_002 for the higher ceiling applicable to persons with disability). *[Verification: VERIFIED; source: SRC005]*
- **R_ESIC_002** (`disability_status` equals `True`) - If the employee is a person with disability (PwD), the applicable wage ceiling is raised to Rs. 25,000/month instead of Rs. 21,000/month. *[Verification: VERIFIED; source: SRC005]*
- **R_ESIC_003** (`establishment_employee_count` greater_than_or_equal `10` employees) - The employee must work at a factory/establishment covered under the ESI Act, 1948, in a district notified by the Central Government, employing 10 or more persons (in most States/UTs). *[Verification: VERIFIED; source: SRC005]*
- **R_ESIC_004** (`employment_type` not_equals `self_employed_or_gig_worker_not_on_payroll`) - Coverage under the ESI Act applies to employees on an employer's payroll at a covered establishment; self-employed individuals, freelancers, and gig/platform workers not on a payroll are not covered under this Act. *[Verification: NEEDS_VERIFICATION; source: SRC009]*

## Benefits
- Medical care for the insured person and dependents at ESIC hospitals/dispensaries. *[VERIFIED, source: SRC005]*
- Statutory cash benefits: sickness benefit, maternity benefit, disablement benefit, and dependents' benefit (in case of employment-related death), funded through employer-employee contributions (0.75% employee / 3.25% employer of gross wages). *[NEEDS_VERIFICATION, source: SRC005]*

## Documents
- **Employer registration documents (Form 1, PAN, address proof, registration certificate, employee list)** - For the EMPLOYER to register the establishment with ESIC. (Mandatory: True) *[NEEDS_VERIFICATION, source: SRC009]*

## Application Process
1. **Employer registers the establishment** - The employer registers the establishment with ESIC online (Form 1, with PAN, address proof, registration certificate, and employee list) within 15 days of the Act becoming applicable.
2. **ESIC issues code number and employee insurance number** - ESIC issues a code number to the establishment and each covered employee receives an insurance number / Pehchan card.

- Official application URL: https://www.esic.gov.in/
- Official helpline: 1800-11-2526 / 1800-11-3839 (numbers referenced in the context of ESIC/PM-JAY convergence on nha.gov.in) - MEDIUM confidence, recommend reconfirming on esic.gov.in

## Important Restrictions
- This is an EMPLOYER-driven registration scheme; an individual employee typically cannot self-enrol without their employer registering the establishment first.
- Coverage during a contribution period continues even if wages rise above the ceiling mid-period; it only lapses for the NEXT contribution period.

## Official Sources
- SRC005: https://www.labour.gov.in/static/uploads/2025/09/d41796103a2224508f023b23c6842c5a.pdf (Ministry of Labour & Employment, dated 28 July 2025 - the strongest, most current primary source in this entire dataset).
- SRC009: https://www.esic.gov.in/ (official portal, referenced only, not deep-fetched in this pass).

## Uncertainties
- State-wise variation in the minimum-establishment-employee threshold (10 vs 20) is UNVERIFIED against an official ESIC circular.
- The self-employed/gig-worker exclusion (R_ESIC_004), while structurally consistent with the ESI Act's employer-employee model, was not found verbatim in an official document fetched in this pass.
- Individual-employee document requirements were not confirmed from a primary source.

## Conflicting Information
See `sources/conflicts.json` -> CONFLICT_004.

## Notes for Developers
- This scheme's core wage-ceiling rule (R_ESIC_001/R_ESIC_002) is HIGH confidence and safe to use in a rule engine as-is.
- Treat R_ESIC_003's state-variation claim and R_ESIC_004 as lower-confidence until manually reconfirmed.
