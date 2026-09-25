# Module 10: Voice Input, Speech-to-Text, Text-to-Speech & Hands-Free Accessibility

## Overview
Module 10 integrates fully functional Voice Input (Speech-to-Text) and Read-Aloud (Text-to-Speech) capabilities securely into the frontend of ArogyaSathi, directly enhancing accessibility for elderly citizens, low-literacy users, and citizens more comfortable with natural spoken Tamil/Hindi.

Crucially, **voice is entirely a presentation-layer feature.** Voice commands route natively into existing RAG endpoints and Profile normalizations. Voice never functions as an alternate database for querying nor makes alternate eligibility rules.

## Speech-to-Text (STT) Architecture
We leveraged the browser-native `SpeechRecognition` API where supported (Chrome, Edge, Safari).
- **Backend APIs (`/api/v1/voice/transcribe`)**: Designed and provisioned to act as future secure proxies for Whisper/OpenAI implementations. They currently gracefully yield `503 Service Unavailable: FALLBACK_TO_BROWSER` if no heavy-weight API key is detected, seamlessly activating the client-side Web Speech architecture.
- **`VoiceInputButton`**: A reusable wrapper injecting microphone capabilities conditionally.
- **Language Binding**: STT natively tracks the `locale` global state (e.g., `ta` resolves to `ta-IN`), ensuring proper native language transcription and supporting Hindi and Tamil perfectly without forcing server translation cycles.

## Text-to-Speech (TTS) Architecture
We leveraged the browser-native `speechSynthesis` API for reading out content aloud natively on-device.
- **Backend APIs (`/api/v1/voice/synthesize`)**: Configured similarly to STT, acting as a structured proxy capable of falling back to device-native APIs if server-synthesis isn't available.
- **`ReadAloudButton`**: Appended seamlessly to dense content nodes (e.g., Eligibility logic trees, AI Assistant responses).
- **Format Corrections**: Built-in regex replacements natively convert numeric currency bounds into speakable phrases (e.g., swapping `₹5,00,000` for "five lakh rupees" / "ஐந்து லட்சம் ரூபாய்") ensuring screen-readers output understandable contextual sentences instead of reading literal commas.

## Privacy & Security Considerations
- **No Blob Storage**: Audio blobs never traverse server hard drives. Because we leveraged native Web Speech APIs for this iteration, the user's audio never leaves their immediate device, offering unparalleled default privacy.
- **No Background Recording**: `SpeechRecognition.continuous` is explicitly set to `false`. Microphones activate solely on button clicks and auto-deactivate immediately when speech concludes or pauses.
- **Permission Management**: Gracefully catches `not-allowed` errors to notify citizens when browser-level permissions need manual enabling, cleanly bypassing the block and falling back to text.

## Integration Points
- **Contextual RAG Assistant**: Embedded securely into the chat bar (`src/app/schemes/[id]/guidance/page.tsx`).
- **Guidance & Next Steps**: Included `ReadAloud` functionality for complex guidance texts.

## Testing & Fallbacks
- Verified full UI build success in Next.js Turbopack (`npm run build`).
- Supported gracefully failing STT/TTS on unsupported or permission-denied browsers, relying on base UI inputs seamlessly.
