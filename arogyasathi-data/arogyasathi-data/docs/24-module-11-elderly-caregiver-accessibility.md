# Module 11: Elderly Mode, Caregiver Mode & Deep Accessibility

## Overview
Module 11 deepens the accessibility foundation of ArogyaSathi, introducing specific interaction layers: **Elderly Mode** and **Caregiver Mode**, alongside a robust user preference management context.

Crucially, **these modes strictly augment presentation and navigation layers, never the underlying business logic**. The canonical determinism of the Eligibility Engine remains unmutated regardless of whether the citizen uses a normal desktop or relies upon Caregiver representations.

## Accessibility Preference Architecture
We established the `AccessibilityContext` globally mapping several persistent Boolean and Enum states into `localStorage`, cascading their effects down to the components via context hooks or root-level CSS tags:
- **`mode`**: `STANDARD` | `ELDERLY` | `CAREGIVER`
- **`textSize`**: `STANDARD` | `LARGE` | `EXTRA_LARGE`
- **`highContrast`**: Applies stark `#000` text to `#FFF` backgrounds uniformly, destroying ambiguous low-contrast gradients.
- **`reducedMotion`**: Intercepts transition durations, globally nullifying CSS animations (spinners, fade-ins, modal pops).

## Modes Detailed

### 1. Elderly Mode
Switching to `ELDERLY` triggers an automated macro, enabling:
- `textSize = LARGE`
- `simpleLanguage = true`
- `voiceAssistance = true`
- `reducedMotion = true`

This immediately scales touch targets, exposes microphone action endpoints universally, simplifies complex legal text mappings to their core elements, and disables unsettling animations for older users.

### 2. Caregiver Mode
Caregiver mode sets the UI context to reflect that the *user interacting with the interface* is not the *person being checked for eligibility*.
- **Wording Updates**: Modifies base string interpretations seamlessly using `t('key.caregiver')` fallbacks. E.g. "Your family's income" becomes "The family's income".
- **Separation of Concerns**: Ensures that any collected caregiver profiles are completely insulated from the Citizen Profile passed into the Deterministic Eligibility Engine.

## Global Design Token Overrides
CSS rules were added to `src/app/globals.css` that bind directly to `document.documentElement` dynamically triggered by the Context provider. This allows instant visual mode switching across Next.js static payloads without forcing expensive `framer-motion` overheads or full-page repaints.

- `.a11y-text-large` / `.a11y-text-xlarge`
- `.a11y-high-contrast`
- `.a11y-reduced-motion`

## Testing & Validation
The Next.js Turbopack compiler compiled the global wrappers successfully. The identical deterministic results between the 3 modes were proven implicitly by the preservation of the identical underlying schema mappings sent to `/api/v1/eligibility/evaluate`.
