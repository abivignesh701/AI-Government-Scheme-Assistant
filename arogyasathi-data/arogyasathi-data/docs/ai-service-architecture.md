# AI Service Architecture

## Role of the AI Service
The `ai-service` acts as a dedicated worker orchestrating all compute-heavy or provider-dependent AI operations:
- **Retrieval Augmented Generation (RAG)**
- **OCR text extraction**
- **Speech to Text (STT)** & **Text to Speech (TTS)**
- **LLM Orchestration & Translation Generation**

## Abstractions
Instead of coupling tightly to one provider, the service employs interfaces:
- `LLMProvider`
- `EmbeddingProvider`
- `OCRProvider`
- `SpeechToTextProvider`
- `TextToSpeechProvider`

## Endpoints (Internal)
- `POST /ai/v1/rag/query` - Contextual vector retrieval and LLM response.
- `POST /ai/v1/ocr/extract` - Vision models bounding box parsing.
- `POST /ai/v1/speech/transcribe` - Audio buffering to text.
- `POST /ai/v1/speech/synthesize` - Text generation to localized audio buffers.

## Caching Strategy
- The AI Service utilizes **Redis** to cache generic RAG query embeddings temporarily, preventing expensive LLM trips for frequently asked standard Q&A inputs.
