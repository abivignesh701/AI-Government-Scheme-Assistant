# Target Architecture

## Recommended Architecture
```text
                         ┌─────────────────────────┐
                         │       Citizen UI        │
                         │ Web / Mobile Responsive │
                         └────────────┬────────────┘
                                      │
                        Text / Form / Voice
                                      │
                         ┌────────────▼────────────┐
                         │ Input Understanding     │
                         │ NLP + Validation        │
                         └────────────┬────────────┘
                                      │
                            Structured Profile
                                      │
              ┌───────────────────────┴─────────────────────────┐
              │                                                 │
     ┌────────▼─────────┐                              ┌────────▼────────┐
     │ Eligibility      │                              │ RAG Assistant   │
     │ Rule Engine      │                              │ Explanation/Q&A │
     └────────┬─────────┘                              └────────┬────────┘
              │                                                 │
     ┌────────▼─────────┐                              ┌────────▼────────┐
     │ Scheme Knowledge │                              │ Vector Store    │
     │ Base             │                              │ + Retrieval     │
     └────────┬─────────┘                              └────────┬────────┘
              │                                                 │
              └──────────────────┬──────────────────────────────┘
                                 │
                      ┌──────────▼──────────┐
                      │ Explanation Layer  │
                      └──────────┬──────────┘
                                 │
                      ┌──────────▼──────────┐
                      │ Sources + Next Step │
                      └─────────────────────┘
```

The deterministic eligibility system and the RAG/LLM system MUST remain separate, keeping factual rule evaluation independent of AI-generated responses.
