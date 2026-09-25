# Revised System Architecture

## Overview
ArogyaSathi has been refactored to cleanly decouple concerns. The system is split into three primary deployment targets:

1. **Frontend**: The user-facing application handling layouts, UI, forms, and client hydration (Next.js).
2. **Backend**: The main API handling authentication, citizen profiles, rule evaluation (deterministic eligibility), and standard CRUD operations (Express + Mongoose).
3. **AI Service**: A dedicated microservice handling purely AI/ML workloads like RAG, LLM orchestration, OCR, STT/TTS (Express API abstraction over Providers).

## Architecture Diagram

```mermaid
graph TD
    User([User / Citizen])
    
    subgraph Frontend [Frontend Application]
        UI[Next.js App Router]
        Pages[Pages & Dashboards]
    end

    subgraph Backend [Backend API Service]
        Auth[Authentication & JWT]
        Elig[Deterministic Eligibility Engine]
        Prof[Citizen Profiles]
    end
    
    subgraph AIService [AI Service]
        RAG[RAG Pipeline]
        OCR[OCR Service]
        Speech[Speech STT/TTS]
        LLM[LLM Orchestration]
    end

    subgraph Databases [Data Storage]
        Mongo[(MongoDB)]
        Redis[(Redis Cache)]
    end
    
    User -->|HTTPS| UI
    UI -->|REST API| Backend
    Backend -->|Internal REST| AIService
    
    Backend --> Mongo
    AIService --> Redis
```

## Security & Separation of Concerns
- **AI Service Isolation**: The AI Service is completely segregated from the Backend API, meaning LLM prompts cannot directly mutate the Canonical Citizen Profile Database. The AI Service is treated as a trusted internal worker only exposed to the Backend API.
- **Deterministic Truth**: The Eligibility rule engine executes strictly on standard Backend logic relying on authenticated Citizen Profiles mapped against JSON Scheme Definitions. No LLM controls this branch.
