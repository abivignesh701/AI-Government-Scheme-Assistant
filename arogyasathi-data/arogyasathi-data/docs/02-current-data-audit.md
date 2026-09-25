# Current Data Audit

The dataset consists of structured information for 5 major schemes:
1. PMJAY (Ayushman Bharat - PM-JAY)
2. VAYVANDANA (Ayushman Vay Vandana Yojana)
3. CGHS (Central Government Health Scheme)
4. ESIC (Employees' State Insurance Scheme)
5. CMCHIS (Chief Minister's Comprehensive Health Insurance Scheme - TN)

## Data Relationships
The relationships are well-designed conceptually:
- `scheme_id` acts as the primary key.
- `schemes.json` lists schemes and maps to `rule_file`, `benefit_file`, `document_file`, and `application_file`.
- Translation files map keys to localized values.
- Source registry maps source IDs to URLs and verification metadata.

## Anomalies and Fixes Required
- Data is manually curated in JSON. This may become hard to manage over time.
- Some verification fields say "NEEDS_VERIFICATION".
- The relationship schema should eventually be ported to a relational database for runtime evaluation.
