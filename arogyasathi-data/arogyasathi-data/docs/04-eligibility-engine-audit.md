# Eligibility Engine Audit

## Current State
The eligibility engine **does not exist in code**. However, the **rule definitions** exist in `rules/*.json`.

## Rule Definition Structure
The structure includes:
- `rule_id`
- `field`
- `operator` (e.g., `in`, `database_match`, `less_than_or_equal`, `requires_verification`)
- `value`
- `user_friendly_explanation`, `pass_message`, `fail_message`, `unknown_message`
- `unknown_behavior` (e.g., `REQUIRES_EXTERNAL_DATABASE_VERIFICATION`, `TREAT_AS_UNKNOWN`)

## Evaluation Logic (To Be Implemented)
The definitions heavily rely on `NEEDS_VERIFICATION` and `UNKNOWN` states, which aligns perfectly with the core project principle of not hallucinating eligibility.

**Missing Engine Features**:
- A runtime environment to evaluate these conditions.
- Logic to combine AND/OR conditions.
- Ranking multiple matching schemes.
