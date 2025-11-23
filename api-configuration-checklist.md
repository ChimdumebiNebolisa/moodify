# API Configuration Checklist

**Project:** Moodify  
**Phase:** 1 - Requirements Refinement

Use this checklist to ensure all API integrations are properly configured before implementation.

---

## 1. Spotify Web API

### Setup Requirements
- [ ] Create Spotify Developer Account
- [ ] Create new app in Spotify Developer Dashboard
- [ ] Obtain `SPOTIFY_CLIENT_ID`
- [ ] Obtain `SPOTIFY_CLIENT_SECRET`
- [ ] Configure redirect URI in Spotify Dashboard
- [ ] Select required OAuth scopes
- [ ] Test OAuth flow in development

### Required Scopes (To Be Confirmed)
- [ ] `playlist-modify-private` - Create private playlists
- [ ] `playlist-modify-public` - Create public playlists (if needed)
- [ ] `user-read-private` - Basic user info
- [ ] `user-read-recently-played` - Listening history (if needed)
- [ ] `user-top-read` - Top tracks/artists (if needed)
- [ ] Other scopes: _______________

### Environment Variables Needed
```
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback/spotify
```

### API Endpoints to Use
- [ ] `POST /v1/users/{user_id}/playlists` - Create playlist
- [ ] `POST /v1/playlists/{playlist_id}/tracks` - Add tracks
- [ ] `GET /v1/me` - Get user profile
- [ ] `GET /v1/me/player/recently-played` - Get listening history (if needed)
- [ ] `GET /v1/me/top/{type}` - Get top tracks/artists (if needed)
- [ ] `GET /v1/search` - Search for tracks

### Rate Limits
- **Standard:** 30 requests per second per user
- **Burst:** Up to 300 requests per 30 seconds
- **Action:** Implement rate limiting and retry logic

---

## 2. LLM API (Provider TBD)

### Provider Selection
- [ ] **OpenAI** (GPT-4/GPT-3.5)
- [ ] **Google Gemini**
- [ ] **Chrome AI** (Gemini via Chrome)
- [ ] **Other:** _______________

### OpenAI Configuration (If Selected)
- [ ] Create OpenAI account
- [ ] Obtain API key
- [ ] Select model (GPT-4, GPT-3.5-turbo, etc.)
- [ ] Set up billing/quota limits
- [ ] Configure rate limiting

**Environment Variable:**
```
OPENAI_API_KEY=your_api_key_here
```

### Google Gemini Configuration (If Selected)
- [ ] Create Google Cloud account
- [ ] Enable Gemini API
- [ ] Obtain API key
- [ ] Set up billing/quota limits
- [ ] Configure rate limiting

**Environment Variable:**
```
GEMINI_API_KEY=your_api_key_here
```

### Chrome AI Configuration (If Selected)
- [ ] Verify Chrome AI setup requirements
- [ ] Obtain API key/credentials
- [ ] Configure access

**Environment Variable:**
```
CHROME_AI_API_KEY=your_api_key_here
```

### Prompt Engineering Requirements
- [ ] Design system prompt for mood analysis
- [ ] Ensure JSON-only response format
- [ ] Add validation for response structure
- [ ] Test prompt with various inputs
- [ ] Handle edge cases (ambiguous moods, etc.)

### Rate Limits (Varies by Provider)
- **OpenAI:** Varies by tier
- **Gemini:** Varies by quota
- **Action:** Implement retry logic and user-friendly errors

---

## 3. ElevenLabs API

### Setup Requirements
- [ ] Create ElevenLabs account
- [ ] Obtain API key
- [ ] Select voice model for TTS
- [ ] Configure STT settings
- [ ] Set up billing/quota limits
- [ ] Test STT and TTS endpoints

### Environment Variable
```
ELEVENLABS_API_KEY=your_api_key_here
```

### API Endpoints to Use
- [ ] `POST /v1/convert` - Speech-to-Text (STT)
- [ ] `POST /v1/text-to-speech/{voice_id}` - Text-to-Speech (TTS)
- [ ] `GET /v1/voices` - List available voices (if needed)

### Configuration Options
- [ ] **Voice ID:** _______________ (default or specific)
- [ ] **STT Model:** _______________
- [ ] **TTS Quality:** _______________ (balance vs. cost)
- [ ] **Language:** English (default)

### Rate Limits
- **Varies by plan:** Check ElevenLabs documentation
- **Action:** Implement queue system for high-volume scenarios

---

## 4. Database (PostgreSQL)

### Provider Selection
- [ ] **Supabase**
- [ ] **Neon**
- [ ] **Other:** _______________

### Supabase Configuration (If Selected)
- [ ] Create Supabase account
- [ ] Create new project
- [ ] Obtain connection string
- [ ] Set up database schema
- [ ] Configure Row Level Security (if needed)
- [ ] Set up backups

**Environment Variable:**
```
DATABASE_URL=postgresql://user:password@host:port/database
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key (if using Supabase client)
```

### Neon Configuration (If Selected)
- [ ] Create Neon account
- [ ] Create new project
- [ ] Obtain connection string
- [ ] Set up database schema
- [ ] Configure connection pooling
- [ ] Set up backups

**Environment Variable:**
```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

### Database Schema Requirements
- [ ] Users table (if not using Supabase Auth)
- [ ] Sessions table
- [ ] Analytics table with required fields:
  - session_id (UUID)
  - user_id (string)
  - timestamp (timestamp)
  - mood_label (string)
  - sentiment_score (numeric)
  - energy_score (numeric)
  - valence_score (numeric)
  - suggested_genres (array)
  - playlist_id (string)
  - playlist_track_count (integer)

---

## 5. Authentication (If Using NextAuth.js)

### NextAuth.js Configuration
- [ ] Install NextAuth.js
- [ ] Configure Spotify provider
- [ ] Set up session strategy
- [ ] Configure JWT secret
- [ ] Set up callback URLs
- [ ] Test authentication flow

### Environment Variables
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here (generate with: openssl rand -base64 32)
```

### Session Configuration
- [ ] **Strategy:** JWT or Database?
- [ ] **Max Age:** _______________ (default: 30 days)
- [ ] **Refresh Token:** Enable?

---

## 6. Environment Variables Summary

Create `.env.local` file with:

```bash
# Spotify
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REDIRECT_URI=

# LLM (choose one)
OPENAI_API_KEY=
# OR
GEMINI_API_KEY=
# OR
CHROME_AI_API_KEY=

# ElevenLabs
ELEVENLABS_API_KEY=

# Database
DATABASE_URL=

# NextAuth (if using)
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# App
NODE_ENV=development
```

---

## 7. Testing Checklist

Before moving to implementation:
- [ ] All API keys obtained and validated
- [ ] OAuth flow tested end-to-end
- [ ] LLM prompt tested with sample inputs
- [ ] ElevenLabs STT/TTS tested
- [ ] Database connection verified
- [ ] Environment variables configured
- [ ] Rate limits understood for each API
- [ ] Error handling strategy defined

---

## 8. Security Considerations

- [ ] API keys stored in environment variables only
- [ ] Never commit `.env.local` to git
- [ ] Use `.env.example` for documentation
- [ ] Implement API key rotation strategy
- [ ] Set up monitoring for API usage
- [ ] Configure CORS properly
- [ ] Validate all user inputs
- [ ] Implement rate limiting on server-side

---

## Notes

- Complete all checked items before proceeding to Phase 2
- Update this checklist as decisions are made
- Keep API keys secure and never expose in client-side code
- Test all integrations in development before production deployment

