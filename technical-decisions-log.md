# Technical Decisions Log

**Project:** Moodify  
**Phase:** 1 - Requirements Refinement  
**Last Updated:** 2024

---

## Decision Status Legend
- ✅ **DECIDED** - Decision made and documented
- ⚠️ **PENDING** - Awaiting user input
- 🔄 **IN REVIEW** - Under consideration

---

## 1. Authentication & OAuth

| Decision | Status | Details | Rationale |
|----------|--------|---------|-----------|
| OAuth Provider | ✅ | Spotify OAuth 2.0 | Required for playlist creation |
| Required Scopes | ⚠️ | TBD | Need: playlist creation, optional: listening history |
| Callback URL | ⚠️ | TBD | Proposed: `/api/auth/callback/spotify` |
| Session Management | ⚠️ | TBD | Options: NextAuth.js, custom JWT, server sessions |
| Token Refresh | ⚠️ | TBD | Proposed: Auto-refresh with retry fallback |

**Recommendation:** Use NextAuth.js for built-in OAuth support and session management.

---

## 2. Database

| Decision | Status | Details | Rationale |
|----------|--------|---------|-----------|
| Database Type | ✅ | PostgreSQL | Required (Supabase/Neon) |
| Provider | ⚠️ | TBD | Options: Supabase, Neon |
| Schema Design | ✅ | Analytics-only | No raw text/audio storage |
| Data Retention | ⚠️ | TBD | Need policy decision |
| Privacy Compliance | ⚠️ | TBD | GDPR requirements? |

**Recommendation:** Supabase for easier setup and built-in features.

---

## 3. LLM Integration

| Decision | Status | Details | Rationale |
|----------|--------|---------|-----------|
| Provider | ⚠️ | TBD | Options: OpenAI, Gemini, Chrome AI |
| Model Version | ⚠️ | TBD | Depends on provider |
| Response Format | ✅ | Strict JSON | Defined in Section C |
| Validation | ✅ | Zod schema | Type-safe validation |
| Error Handling | ⚠️ | TBD | Retry strategy needed |

**JSON Schema:**
```typescript
{
  mood_label: string;
  sentiment_score: number; // -1 to 1
  energy_score: number; // 1 to 10
  valence_score: number; // 1 to 10
  suggested_genres: string[]; // 3-8 genres
  voice_script: string;
}
```

---

## 4. ElevenLabs Integration

| Decision | Status | Details | Rationale |
|----------|--------|---------|-----------|
| STT Service | ✅ | ElevenLabs | Voice input processing |
| TTS Service | ✅ | ElevenLabs | Playlist explanation narration |
| API Key | ⚠️ | TBD | Need confirmation |
| Voice Model | ⚠️ | TBD | Default or specific preference? |
| Quality Settings | ⚠️ | TBD | Balance quality vs. cost |

---

## 5. Spotify Integration

| Decision | Status | Details | Rationale |
|----------|--------|---------|-----------|
| API Version | ✅ | Web API v1 | Current stable version |
| Playlist Creation | ✅ | Required | Core feature |
| Listening History | ⚠️ | Optional | User preference toggle? |
| Playlist Visibility | ⚠️ | TBD | Default: private/public? |
| Error Handling | ⚠️ | TBD | Retry and fallback strategy |

---

## 6. Frontend Framework

| Decision | Status | Details | Rationale |
|----------|--------|---------|-----------|
| Framework | ✅ | Next.js | App Router specified |
| Version | ⚠️ | TBD | Options: 14.x (stable), 15.x (latest) |
| TypeScript | ✅ | Strict mode | Required |
| UI Library | ✅ | shadcn/ui | Specified |
| Styling | ✅ | Tailwind CSS | Specified |
| Icons | ✅ | lucide-react | Specified |

**Recommendation:** Next.js 14.x for stability.

---

## 7. Architecture Patterns

| Decision | Status | Details | Rationale |
|----------|--------|---------|-----------|
| Component Pattern | ✅ | Server-first | Server components by default |
| State Management | ✅ | Minimal | Local UI state only |
| Business Logic | ✅ | `/lib` directory | Separation of concerns |
| API Routes | ✅ | RESTful | GET for read, POST for write |
| Validation | ✅ | Zod | Schema validation |

---

## 8. Deployment

| Decision | Status | Details | Rationale |
|----------|--------|---------|-----------|
| Platform | ⚠️ | TBD | Options: Vercel, Netlify, self-hosted |
| Environment | ⚠️ | TBD | Production URL needed |
| CI/CD | ⚠️ | TBD | Automated deployment? |

**Recommendation:** Vercel for seamless Next.js deployment.

---

## 9. Error Handling Strategy

| Decision | Status | Details | Rationale |
|----------|--------|---------|-----------|
| Client Errors | ⚠️ | TBD | Toast notifications? Inline? |
| API Failures | ⚠️ | TBD | Retry logic, user messaging |
| Rate Limiting | ⚠️ | TBD | Client + server-side handling |
| Fallback Behavior | ⚠️ | TBD | Graceful degradation |

---

## 10. User Experience

| Decision | Status | Details | Rationale |
|----------|--------|---------|-----------|
| Voice Input | ⚠️ | TBD | Browser recording vs. upload |
| Loading States | ⚠️ | TBD | Spinner, skeleton, progress bar |
| Mobile Support | ✅ | Mobile-first | Required |
| Accessibility | ⚠️ | TBD | WCAG compliance level? |

---

## Notes

- All decisions marked ⚠️ require user input before proceeding to Phase 2
- Recommendations are based on best practices and project requirements
- Decisions can be revised during implementation if needed
- This log should be updated as decisions are made

