# ArogyaSathi Data / Knowledge Base

**Generated:** 2026-09-25
**Status:** Hackathon prototype knowledge base - DATA ONLY (no frontend, backend, API, or database server included).

## 1. What This Repository Contains

A machine-readable and human-readable knowledge base of 5 real Indian government health-insurance /
health-assurance schemes, structured so a future developer can plug it directly into a rule-based
eligibility-matching engine:

- **Ayushman Bharat PM-JAY** (`PMJAY`) - central, SECC-2011-database-based
- **Ayushman Vay Vandana Yojana** (`VAYVANDANA`) - central, age-70+ expansion of PM-JAY
- **Central Government Health Scheme** (`CGHS`) - central, government-employee scheme
- **Employees' State Insurance Scheme** (`ESIC`) - central, wage-ceiling-based
- **Chief Minister's Comprehensive Health Insurance Scheme** (`CMCHIS`) - Tamil Nadu state scheme

## 2. How It Was Researched

Every fact was sourced via live web search and direct fetches of official government pages/PDFs on 2026-09-25.
No fact was generated from general model knowledge without a cited source. Where no authoritative source
could be found or two sources disagreed, the data is explicitly marked `"NEEDS_VERIFICATION"` rather than
guessed. See `research/research-summary.md` for the full methodology note and `sources/conflicts.json` for
every unresolved disagreement found.

## 3. Source Hierarchy Used

1. Official Government sources (ministry/agency websites)
2. Official government department sources
3. Official scheme portals
4. Official government PDFs / guidelines / circulars
5. myScheme (Government of India scheme-discovery portal) - used for discovery/cross-reference only

Secondary sources (blogs, insurance-company sites, aggregators, Wikipedia, etc.) were used ONLY to locate
candidate facts, never as the cited authority. Every field in every JSON file traces back to a `source_id`
that resolves in `sources/source_registry.json`.

## 4. How Eligibility Rules Are Represented

Each scheme has a file in `rules/<scheme_id>_rules.json` containing an array of rule objects:

```json
{
  "rule_id": "R_ESIC_001",
  "field": "monthly_gross_wage",
  "operator": "less_than_or_equal",
  "value": 21000,
  "unit": "INR_per_month",
  "required": true,
  "description": "...",
  "user_friendly_explanation": "...",
  "pass_message": "...",
  "fail_message": "...",
  "unknown_message": "...",
  "source_id": "SRC005",
  "verification_status": "VERIFIED",
  "unknown_behavior": "TREAT_AS_UNKNOWN"
}
```

How multiple rules combine into a final scheme-level result is documented per scheme in
`master/eligibility_rules.json` under `matching_logic_by_scheme`, using one of: `ALL_REQUIRED_RULES_PASS`,
`COMPOUND` (with an explicit boolean `expression`), or `DATABASE_VERIFICATION_REQUIRED` (for PM-JAY, which
is fundamentally a database lookup, not a computable formula).

## 5. PASS / FAIL / UNKNOWN / NOT_APPLICABLE

Every rule declares an explicit `unknown_behavior`. A rule engine consuming this data **must**:

- Return `UNKNOWN` (never silently `FAIL`) when a required input is missing and `unknown_behavior` says
  `TREAT_AS_UNKNOWN` or similar.
- Return a special `REQUIRES_EXTERNAL_DATABASE_VERIFICATION` status (not `PASS`) for PM-JAY's core rule
  (`R_PMJAY_001`), since only the official beneficiary database can truly confirm inclusion.
- Return `NOT_APPLICABLE` for informational rules explicitly flagged `NOT_APPLICABLE_AS_GATE`
  (e.g., PM-JAY's "no family-size cap" rule, which can never fail and should not be scored).
- Never treat `"unknown"` as equivalent to `"no"`. This is a hard requirement carried over from the
  project brief and is tested in `test_cases/eligibility_test_cases.json` (see TC003, TC004, TC008, TC009).

## 6. How Developers Should Consume This Data

1. Load `master/scheme_index.json` to get the list of scheme IDs.
2. For each scheme, load `schemes/<scheme_id>.json` for basic info, then `rules/<scheme_id>_rules.json`
   and the matching logic in `master/eligibility_rules.json` to run the actual eligibility check.
3. Look up `benefits/benefits.json` and `documents/documents.json` (both keyed by scheme_id) and
   `applications/applications.json` for the "why matched -> benefits -> documents -> application steps" flow
   the project brief specifies.
4. Always surface a rule's `verification_status` and `unknown_behavior` alongside any PASS/FAIL result in
   the UI - do not hide the uncertainty from the end user.
5. Use `translations/en.json`, `ta.json`, `hi.json` for UI terminology; do NOT translate official scheme
   names (each translation file lists the names to preserve verbatim).
6. Use `test_cases/eligibility_test_cases.json` to validate any rule-engine implementation before trusting it.

## 7. How to Update a Scheme

1. Re-research the specific fact using an official source (see the hierarchy in section 3).
2. Add or update the source in `sources/source_registry.json` with a new `source_id` (never reuse or
   silently overwrite an existing `source_id`'s meaning).
3. Update the relevant rule/benefit/document/application object's `source_id` reference and
   `verification_status`.
4. If the new fact conflicts with an existing one instead of clearly superseding it, add an entry to
   `sources/conflicts.json` rather than silently picking a value.
5. Update `last_verified` / `accessed_date` fields in the scheme's file under `schemes/`.
6. Re-run the JSON validation step described in section 8 below.

## 8. How to Verify Changes (validation checklist)

- [ ] All JSON files parse without error (`python3 -m json.tool <file>` on each, or use a bulk validator).
- [ ] Every `source_id` referenced anywhere actually exists in `sources/source_registry.json`.
- [ ] Every `rule_id` is globally unique across all `rules/*.json` files.
- [ ] Every scheme referenced in `master/schemes.json` has a matching file in `schemes/`, `rules/`, and
      entries in `benefits/benefits.json`, `documents/documents.json`, `applications/applications.json`.
- [ ] No new fact was added without a `source_id` and a `verification_status`.
- [ ] `data-quality-report.md` regenerated to reflect the change.

This project's own generator script (used to build this repository) performs an automated version of this
checklist - see the "Final Validation" output captured in `data-quality-report.md`.

## 9. Important Limitations

- **This is NOT an official government database and has NO affiliation with the Government of India or
  the Government of Tamil Nadu.**
- It does **not** provide guaranteed eligibility determinations. Every PM-JAY-related result is explicitly
  a "preliminary rule-based eligibility assessment," never an "official government eligibility verification."
- It does **not** have real-time access to any government beneficiary database (SECC 2011, ESIC records,
  CGHS records, CMCHIS records, etc.). Where a scheme's true eligibility can only be confirmed by such a
  database (notably PM-JAY), this dataset says so explicitly and points to the correct official portal.
- Some data (notably CGHS's city list and CMCHIS's income ceiling) is confirmed outdated or unresolved and
  is clearly flagged - do not silently "fix" these by picking a number without doing the verification work
  described in section 7.
- This dataset covers only 5 schemes. Most Indian state health schemes are NOT yet represented (see
  `schemes/` - the absence of a state's scheme here does not mean that state has no scheme).

## 10. Folder Structure

```
arogyasathi-data/
├── README.md                        (this file)
├── data-quality-report.md
├── schemes/                         5 files - one JSON object per scheme, basic info + factor summary
├── rules/                           5 files - one JSON array of eligibility rules per scheme
├── benefits/benefits.json           all benefits, keyed by scheme_id
├── documents/documents.json         all required documents, keyed by scheme_id
├── applications/applications.json   all application/enrolment steps, keyed by scheme_id
├── sources/
│   ├── source_registry.json         all 10 sources cited anywhere in this repository
│   └── conflicts.json               5 explicitly logged, unresolved factual conflicts
├── translations/{en,ta,hi}.json    UI terminology in English, Tamil, Hindi (scheme names preserved)
├── test_cases/eligibility_test_cases.json   10 test cases covering the required scenarios
├── master/
│   ├── schemes.json                 concise scheme index with file cross-references
│   ├── eligibility_rules.json       ALL rules + matching logic, flattened for engine consumption
│   └── scheme_index.json            scheme_id -> name/level/status lookup
└── research/
    ├── pmjay.md / vayvandana.md / cghs.md / esic.md / cmchis.md
    └── research-summary.md
```
