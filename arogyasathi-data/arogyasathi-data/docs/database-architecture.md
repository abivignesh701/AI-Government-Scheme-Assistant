# Database Architecture

## Primary Persistence (MongoDB)
ArogyaSathi will utilize **MongoDB** as the canonical database storing:
- `users`: Authentication and identity records.
- `citizen_profiles`: Standardized structured schemas of users determining eligibility bounds.
- `evaluations`: Cached results of the Deterministic Rule engine logic.
- `application_tracking`: Status of citizen workflows mapping to specific schemes.

*Current Status: Awaiting Connection Credentials. Models scaffolded internally via Mongoose.*

## Ephemeral Cache (Redis)
ArogyaSathi utilizes **Redis** for temporary state handling mapping explicitly to the AI-Service and core backend rate limiters:
- `rate_limits`: Brute-force protections natively handling `/login` thresholds.
- `rag_cache`: Storing hashed query embeddings avoiding redundant API requests.

*Current Status: Awaiting Redis Connection Configs.*

## Knowledge Stores
- `data/master`: Maintains the offline JSON configurations of Government Schemes mapping cleanly for Deterministic analysis. Ultimately, this may be mirrored into MongoDB Collections in upcoming modules.
