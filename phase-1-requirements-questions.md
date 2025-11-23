# Phase 1: Requirements Refinement - Clarification Questions

## 1. Authentication & Spotify OAuth

### Required Spotify OAuth Scopes
Which Spotify OAuth scopes do you need?
- `user-read-private` (basic profile info)
- `user-read-email` (user email)
- `playlist-modify-public` (create public playlists)
- `playlist-modify-private` (create private playlists)
- `user-read-recently-played` (access listening history)
- `user-top-read` (access top tracks/artists)
- `user-read-playback-state` (current playback state)
- Other specific scopes?

### OAuth Callback URL Structure
What should the OAuth callback URL be?
- `/api/auth/callback/spotify`
- `/auth/callback`
- Other preference?

### Session Management
How should we manage user sessions?
- NextAuth.js / Auth.js
- Custom session with JWT tokens
- Server-side sessions with cookies
- Other approach?

### Token Refresh Strategy
How should we handle token refresh?
- Automatic refresh before expiration
- Refresh on-demand when API calls fail
- Background refresh worker
- Other strategy?

---

## 2. Database & Analytics

### Database Provider
Which database provider do you prefer?
- Supabase (PostgreSQL with built-in auth)
- Neon (serverless PostgreSQL)
- Other?

### Analytics Data Points
What specific analytics should we store? (Confirm each)
- Session ID
- Timestamp
- Mood label
- Sentiment score
- Energy score
- Valence score
- Suggested genres (array)
- Playlist ID (from Spotify)
- User ID (from Spotify)
- Number of tracks in playlist
- Other metrics?

### Data Retention
How long should we retain analytics data?
- Indefinitely
- 1 year
- 6 months
- Other?

### Privacy Requirements
Any specific privacy requirements?
- Anonymize user data after X days?
- Allow users to delete their analytics?
- GDPR compliance needed?
- Other requirements?

---

## 3. API Integrations

### LLM Provider
Which LLM provider should we use?
- OpenAI (GPT-4/GPT-3.5)
- Google Gemini
- Chrome AI (Gemini via Chrome)
- Other?

### ElevenLabs Configuration
- Do you have an ElevenLabs API key?
- Which voice model should we use? (default or specific voice ID)
- Any specific STT/TTS settings or preferences?

### Rate Limiting
How should we handle rate limits?
- Client-side rate limiting
- Server-side queue system
- User-friendly error messages
- Retry logic with exponential backoff
- Other strategies?

### API Key Management
How should we manage API keys?
- Environment variables only
- Encrypted storage
- Key rotation strategy
- Other approach?

---

## 4. User Flow & Features

### Voice Input Method
How should users provide voice input?
- Browser-based recording (MediaRecorder API)
- File upload
- Both options
- Other?

### Playlist Creation Permissions
What should be the default playlist visibility?
- Private (default)
- Public
- Collaborative
- User choice (with default)

### Listening History Integration
How should we use listening history?
- Always use if available
- Ask user permission first
- Optional toggle in UI
- Not used at all

### Error Handling
What should happen when:
- Spotify API fails?
- LLM API fails?
- ElevenLabs API fails?
- User denies OAuth permissions?
- Network errors occur?

---

## 5. Technical Stack Decisions

### Next.js Version
Which Next.js version?
- Latest (15.x)
- 14.x (stable)
- Specific version?

### TypeScript Configuration
TypeScript strictness level?
- Strict mode enabled (recommended)
- Standard mode
- Custom configuration?

### Environment Variables Structure
What environment variables do you need?
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REDIRECT_URI`
- `OPENAI_API_KEY` (or other LLM key)
- `ELEVENLABS_API_KEY`
- `DATABASE_URL`
- `NEXTAUTH_SECRET` (if using NextAuth)
- `NEXTAUTH_URL`
- Others?

### Deployment Target
Where will this be deployed?
- Vercel
- Netlify
- Self-hosted
- Other?

---

## 6. UI/UX Specifications

### Page Routes
Confirm the exact route structure:
- `/` - Landing page or redirect?
- `/login` - Spotify OAuth login
- `/mood` - Input page (text/voice)
- `/result` - Playlist result with TTS explanation
- `/analytics` - Analytics dashboard
- Other routes needed?

### Loading States
What loading indicators do you need?
- Spinner during LLM processing
- Progress bar for voice recording
- Skeleton screens
- Other?

### Error Messages
How should errors be displayed?
- Toast notifications
- Inline error messages
- Error page redirects
- Modal dialogs
- Combination?

### Mobile Responsiveness
Any specific mobile requirements?
- Mobile-first design (already specified)
- Specific breakpoints?
- Touch gesture support?
- Other mobile considerations?

