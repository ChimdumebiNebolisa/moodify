# Moodify - Requirements Specification

**Version:** 1.0  
**Date:** 2024  
**Status:** Phase 1 - Requirements Refinement

---

## 1. Project Overview

**Moodify** is a full-stack application that:
1. Accepts user mood input (text or voice)
2. Uses AI to analyze emotion and generate structured mood data
3. Creates personalized Spotify playlists based on mood
4. Provides voice narration explaining the playlist selection
5. Tracks analytics (no raw text/audio stored)

**Core Principle:** No guest mode - users MUST authenticate with Spotify.

---

## 2. Authentication & Spotify OAuth

### 2.1 Required OAuth Scopes
**Status:** ⚠️ **NEEDS CLARIFICATION**

**Questions:**
- Which scopes are needed for playlist creation?
- Do we need listening history access?
- Do we need user profile data?

**Recommended Minimum:**
- `playlist-modify-private` (create private playlists)
- `playlist-modify-public` (create public playlists - if user chooses)
- `user-read-private` (basic user info)

**Optional (if using listening history):**
- `user-read-recently-played`
- `user-top-read`

### 2.2 OAuth Callback URL
**Status:** ⚠️ **NEEDS CLARIFICATION**

**Proposed:** `/api/auth/callback/spotify`

### 2.3 Session Management
**Status:** ⚠️ **NEEDS CLARIFICATION**

**Options:**
- NextAuth.js / Auth.js (recommended for Next.js)
- Custom JWT-based sessions
- Server-side cookie sessions

**Recommendation:** NextAuth.js for built-in OAuth support and session management.

### 2.4 Token Refresh Strategy
**Status:** ⚠️ **NEEDS CLARIFICATION**

**Proposed:** Automatic refresh before expiration with fallback retry on 401 errors.

---

## 3. Database & Analytics

### 3.1 Database Provider
**Status:** ⚠️ **NEEDS CLARIFICATION**

**Options:**
- Supabase (PostgreSQL + built-in features)
- Neon (serverless PostgreSQL)

**Recommendation:** Supabase for easier setup and built-in features.

### 3.2 Analytics Data Points
**Status:** ✅ **DEFINED** (from project overview)

**Stored Data:**
- `session_id` (UUID)
- `user_id` (Spotify user ID)
- `timestamp` (created_at)
- `mood_label` (string)
- `sentiment_score` (number, -1 to 1)
- `energy_score` (number, 1 to 10)
- `valence_score` (number, 1 to 10)
- `suggested_genres` (string array)
- `playlist_id` (Spotify playlist ID)
- `playlist_track_count` (number)

**NOT Stored:**
- Raw text input
- Audio files
- Voice recordings
- Full playlist track lists

### 3.3 Analytics Dashboard Metrics
**Status:** ✅ **DEFINED** (from project overview)

- Total sessions
- Mood frequencies (distribution chart)
- Average energy score
- Genre distribution

### 3.4 Data Retention
**Status:** ⚠️ **NEEDS CLARIFICATION**

**Question:** How long should analytics data be retained?

### 3.5 Privacy Requirements
**Status:** ⚠️ **NEEDS CLARIFICATION**

**Questions:**
- Allow users to delete their analytics?
- GDPR compliance required?
- Data anonymization needed?

---

## 4. API Integrations

### 4.1 LLM Provider
**Status:** ⚠️ **NEEDS CLARIFICATION**

**Options:**
- OpenAI (GPT-4/GPT-3.5)
- Google Gemini
- Chrome AI (Gemini via Chrome)

**Question:** Which provider do you prefer?

### 4.2 LLM Response Schema
**Status:** ✅ **DEFINED** (from Section C)

```json
{
  "mood_label": string,
  "sentiment_score": number,  // -1 to 1
  "energy_score": number,     // 1 to 10
  "valence_score": number,    // 1 to 10
  "suggested_genres": string[], // 3-8 genres
  "voice_script": string       // TTS explanation
}
```

**Rules:**
- JSON ONLY, no text outside JSON
- Strict validation required
- Retry on malformed responses

### 4.3 ElevenLabs Configuration
**Status:** ⚠️ **NEEDS CLARIFICATION**

**Questions:**
- Do you have an ElevenLabs API key?
- Preferred voice model/ID?
- STT/TTS quality settings?

**Features Needed:**
- Speech-to-Text (STT) for voice input
- Text-to-Speech (TTS) for playlist explanation

### 4.4 Rate Limiting & Error Handling
**Status:** ⚠️ **NEEDS CLARIFICATION**

**Proposed Strategy:**
- Client-side: Disable submit button during processing
- Server-side: Queue system for API calls
- Retry logic: Exponential backoff for transient errors
- User-friendly error messages for all failure scenarios

**Error Scenarios to Handle:**
- Spotify API failures
- LLM API failures
- ElevenLabs API failures
- Network timeouts
- Invalid responses

### 4.5 API Key Management
**Status:** ⚠️ **NEEDS CLARIFICATION**

**Proposed:** Environment variables with validation on app startup.

---

## 5. User Flow & Features

### 5.1 Voice Input Method
**Status:** ⚠️ **NEEDS CLARIFICATION**

**Options:**
- Browser-based recording (MediaRecorder API) - recommended
- File upload
- Both options

**Recommendation:** Browser-based recording for better UX.

### 5.2 Playlist Creation Permissions
**Status:** ⚠️ **NEEDS CLARIFICATION**

**Question:** Default playlist visibility?
- Private (recommended for privacy)
- Public
- User choice with default

**Recommendation:** Private by default, with option to make public.

### 5.3 Listening History Integration
**Status:** ⚠️ **NEEDS CLARIFICATION**

**Question:** How should we use listening history?
- Always use if available
- Ask user permission first (recommended)
- Optional toggle in UI
- Not used

**Recommendation:** Optional toggle in UI, off by default.

### 5.4 Error Handling
**Status:** ⚠️ **NEEDS CLARIFICATION**

**Proposed Error Handling:**
- **Spotify API fails:** Show error message, allow retry
- **LLM API fails:** Show error, allow re-submission
- **ElevenLabs API fails:** Fallback to text-only explanation
- **OAuth denied:** Redirect to login with clear message
- **Network errors:** Retry button with clear messaging

---

## 6. Technical Stack Decisions

### 6.1 Next.js Version
**Status:** ⚠️ **NEEDS CLARIFICATION**

**Question:** Next.js version preference?
- Latest (15.x)
- 14.x (stable, recommended)

**Recommendation:** Next.js 14.x for stability.

### 6.2 TypeScript Configuration
**Status:** ✅ **DEFINED** (strict mode required)

**Configuration:**
- Strict mode: Enabled
- No implicit any
- Strict null checks

### 6.3 Environment Variables
**Status:** ⚠️ **NEEDS CLARIFICATION**

**Required Variables:**
```
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REDIRECT_URI=
[LLM]_API_KEY= (OpenAI/Gemini/Chrome AI)
ELEVENLABS_API_KEY=
DATABASE_URL=
NEXTAUTH_SECRET= (if using NextAuth)
NEXTAUTH_URL=
```

**Question:** Any additional environment variables needed?

### 6.4 Deployment Target
**Status:** ⚠️ **NEEDS CLARIFICATION**

**Question:** Deployment platform?
- Vercel (recommended for Next.js)
- Netlify
- Self-hosted
- Other

---

## 7. UI/UX Specifications

### 7.1 Page Routes
**Status:** ✅ **DEFINED** (from project overview)

**Routes:**
- `/` - Landing/redirect to login (if not authenticated)
- `/login` - Spotify OAuth login page
- `/mood` - Input page (text/voice input)
- `/result` - Playlist result with TTS explanation
- `/analytics` - Analytics dashboard

**Question:** Any additional routes needed?

### 7.2 Design System
**Status:** ✅ **DEFINED** (from Section D)

**Colors:**
- Primary: `#6366f1` (indigo-500)
- Accent: `#8b5cf6` (violet-500)
- Background: `#f9fafb`
- Surfaces: Neutral gray

**Components:** shadcn/ui (Card, Button, Input, Textarea, Dialog, Sheet, Tabs)

**Spacing:** `p-4`, `p-6`, `p-8` only

**Border Radius:** `rounded-xl` always

**Icons:** lucide-react only

**Typography:**
- Title: `text-3xl font-semibold tracking-tight`
- Section: `text-xl font-medium`
- Body: `text-base text-muted-foreground`

**Layout:** `max-w-3xl mx-auto` for containers

### 7.3 Loading States
**Status:** ⚠️ **NEEDS CLARIFICATION**

**Proposed:**
- Spinner during LLM processing
- Progress indicator for voice recording
- Skeleton screens for playlist loading

**Question:** Any specific loading state preferences?

### 7.4 Error Messages
**Status:** ⚠️ **NEEDS CLARIFICATION**

**Proposed:** Toast notifications (shadcn/ui) with inline error messages where appropriate.

**Question:** Preferred error display method?

### 7.5 Mobile Responsiveness
**Status:** ✅ **DEFINED** (mobile-first, from Section D)

**Requirements:**
- Mobile-first design
- Touch-friendly interactions
- Responsive layouts

---

## 8. Architecture Principles

**Status:** ✅ **DEFINED** (from Section B)

1. Business logic in `/lib` (not components)
2. Database operations in `/lib/db/**`
3. API integrations in `/lib/external/**`
4. Components: small, pure, stateless
5. State management: minimal (local UI state only)
6. Server actions/API routes for backend interaction
7. No logic duplication

---

## 9. Coding Standards

**Status:** ✅ **DEFINED** (from Section A)

1. Strict TypeScript everywhere
2. Named exports (no default exports except Next.js conventions)
3. Server components by default
4. Client components only when needed
5. 2-space indentation
6. No unused imports
7. Descriptive variable names
8. No commented-out code
9. Zod for schema validation (if approved)
10. Clear function typing
11. Input validation

---

## 10. Open Questions Summary

### Critical (Blocking Implementation):
1. **Spotify OAuth scopes** - Which scopes are needed?
2. **LLM provider** - OpenAI, Gemini, or Chrome AI?
3. **Database provider** - Supabase or Neon?
4. **ElevenLabs API key** - Do you have one? Voice preferences?

### Important (Affects Architecture):
5. **Session management** - NextAuth.js or custom?
6. **Voice input method** - Browser recording or file upload?
7. **Playlist visibility** - Default private/public?
8. **Listening history** - How to integrate?
9. **Deployment target** - Vercel, Netlify, or other?

### Nice to Have (Can be decided later):
10. **Data retention policy**
11. **Privacy/GDPR requirements**
12. **Loading state preferences**
13. **Error message display method**

---

## Next Steps

Once all questions are answered, proceed to:
- **Phase 2:** User Stories
- **Phase 3:** Entities, Data Modeling, Table Structure

