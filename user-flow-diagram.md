# Moodify - User Flow Diagram

**Version:** 1.0  
**Format:** Text-based flow diagram

---

## Main User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         LANDING PAGE (/)                         │
│                                                                   │
│  - Check authentication status                                   │
│  - If not authenticated → Redirect to /login                    │
│  - If authenticated → Redirect to /mood                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ (Not authenticated)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        LOGIN PAGE (/login)                       │
│                                                                   │
│  - Display "Sign in with Spotify" button                        │
│  - Initiate Spotify OAuth flow                                  │
│  - Handle OAuth callback                                        │
│  - Store session/tokens                                         │
│  - Redirect to /mood after successful auth                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ (Authentication successful)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MOOD INPUT PAGE (/mood)                     │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Input Method Selection (Tabs)                          │   │
│  │  - Text Input Tab                                       │   │
│  │  - Voice Input Tab                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  TEXT INPUT MODE                                        │   │
│  │  - Textarea for mood description                        │   │
│  │  - Character counter (optional)                         │   │
│  │  - Submit button                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  VOICE INPUT MODE                                       │   │
│  │  - Record button                                        │   │
│  │  - Stop button (appears during recording)              │   │
│  │  - Audio waveform visualization (optional)             │   │
│  │  - Playback preview (optional)                         │   │
│  │  - Submit button (enabled after recording)             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  OPTIONAL SETTINGS                                      │   │
│  │  - [ ] Use my listening history (toggle)               │   │
│  │  - Playlist visibility: [Private ▼] [Public]          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [Submit Button] → Process input                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ (User submits)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PROCESSING STATE (Loading)                    │
│                                                                   │
│  Step 1: Convert voice to text (if voice input)                │
│    └─> ElevenLabs STT API                                       │
│                                                                   │
│  Step 2: Analyze mood with LLM                                 │
│    └─> LLM API (OpenAI/Gemini/Chrome AI)                       │
│    └─> Validate JSON response                                  │
│    └─> Extract: mood_label, scores, genres, voice_script      │
│                                                                   │
│  Step 3: Search Spotify for tracks                             │
│    └─> Spotify Search API                                      │
│    └─> Filter by genres, energy, valence                       │
│    └─> Optionally use listening history                        │
│                                                                   │
│  Step 4: Create Spotify playlist                               │
│    └─> Spotify Create Playlist API                             │
│    └─> Add tracks to playlist                                  │
│                                                                   │
│  Step 5: Generate TTS explanation                              │
│    └─> ElevenLabs TTS API (voice_script)                       │
│                                                                   │
│  Step 6: Store analytics (no raw data)                         │
│    └─> Database insert (mood data, playlist ID)                │
│                                                                   │
│  [Loading indicator: Spinner/Progress bar]                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ (Processing complete)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RESULT PAGE (/result)                        │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  MOOD ANALYSIS SUMMARY                                  │   │
│  │  - Mood Label: "Energetic & Happy"                     │   │
│  │  - Sentiment: 0.8 (positive)                           │   │
│  │  - Energy: 8/10                                        │   │
│  │  - Valence: 7/10                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  SPOTIFY PLAYLIST EMBED                                 │   │
│  │  - Playlist name                                        │   │
│  │  - Track count                                          │   │
│  │  - "Open in Spotify" button                            │   │
│  │  - Spotify embed widget (optional)                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  VOICE EXPLANATION                                      │   │
│  │  - Audio player with TTS narration                      │   │
│  │  - Play/Pause button                                    │   │
│  │  - Transcript (optional, collapsible)                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [Create Another Playlist] [View Analytics]                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ (User clicks "View Analytics")
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  ANALYTICS PAGE (/analytics)                    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  OVERVIEW STATS                                         │   │
│  │  - Total Sessions: 42                                   │   │
│  │  - Average Energy: 6.5/10                               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  MOOD FREQUENCY CHART                                   │   │
│  │  - Bar chart or pie chart                               │   │
│  │  - Shows distribution of mood labels                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  GENRE DISTRIBUTION                                     │   │
│  │  - Horizontal bar chart                                 │   │
│  │  - Top genres by frequency                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  RECENT SESSIONS                                        │   │
│  │  - List of recent playlists created                     │   │
│  │  - Date, mood, playlist link                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [Back to Create Playlist]                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Error Flow Scenarios

### Authentication Errors

```
┌─────────────────────────────────────────────────────────────────┐
│  OAuth Denied / Token Expired                                   │
│  └─> Show error message                                         │
│  └─> Redirect to /login                                         │
│  └─> Clear invalid session                                      │
└─────────────────────────────────────────────────────────────────┘
```

### API Error Scenarios

```
┌─────────────────────────────────────────────────────────────────┐
│  ElevenLabs STT Failure                                         │
│  └─> Show error: "Voice processing failed"                     │
│  └─> Offer: "Try again" or "Switch to text input"              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  LLM API Failure                                                │
│  └─> Show error: "Mood analysis failed"                        │
│  └─> Offer: "Retry" button                                     │
│  └─> Log error for debugging                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Spotify API Failure                                            │
│  └─> Show error: "Playlist creation failed"                    │
│  └─> Offer: "Retry" button                                     │
│  └─> Check token validity, refresh if needed                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  ElevenLabs TTS Failure                                         │
│  └─> Show warning: "Voice explanation unavailable"             │
│  └─> Display text transcript instead                           │
│  └─> Continue to result page                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Network Errors

```
┌─────────────────────────────────────────────────────────────────┐
│  Network Timeout / Connection Lost                              │
│  └─> Show error: "Connection lost"                             │
│  └─> Offer: "Retry" button                                     │
│  └─> Preserve user input if possible                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Navigation Flow

```
┌──────────┐
│   /      │ ← Landing (redirects based on auth)
└────┬─────┘
     │
     ├─> /login (if not authenticated)
     │
     └─> /mood (if authenticated)
            │
            ├─> /result (after processing)
            │      │
            │      ├─> /mood (create another)
            │      │
            │      └─> /analytics
            │             │
            │             └─> /mood (back to create)
            │
            └─> /analytics (from nav menu)
                   │
                   └─> /mood (back to create)
```

---

## State Transitions

### Authentication States
- **Unauthenticated** → Must visit `/login`
- **Authenticated** → Can access `/mood`, `/result`, `/analytics`
- **Token Expired** → Redirect to `/login`, clear session

### Input States
- **Idle** → Ready for input
- **Recording** → Voice input in progress
- **Processing** → API calls in progress
- **Success** → Redirect to `/result`
- **Error** → Show error, allow retry

### Playlist States
- **Creating** → Spotify API call in progress
- **Created** → Playlist available, show in `/result`
- **Failed** → Show error, allow retry

---

## User Actions & Outcomes

| User Action | Current Page | Outcome |
|-------------|--------------|---------|
| Click "Sign in with Spotify" | `/login` | OAuth flow → `/mood` |
| Enter text & submit | `/mood` | Process → `/result` |
| Record voice & submit | `/mood` | STT → Process → `/result` |
| Click "Create Another" | `/result` | Navigate to `/mood` |
| Click "View Analytics" | `/result` | Navigate to `/analytics` |
| Click "Back to Create" | `/analytics` | Navigate to `/mood` |
| Session expires | Any | Redirect to `/login` |

---

## Notes

- All routes require authentication except `/login`
- `/` always redirects (no standalone landing page content)
- Error states allow recovery without losing progress where possible
- Loading states provide feedback at each processing step
- Mobile navigation should be accessible via bottom nav or hamburger menu

