# Database Schema Requirements

**Project:** Moodify  
**Phase:** 1 - Requirements Refinement  
**Database:** PostgreSQL (Supabase or Neon)

---

## Overview

The database stores **analytics data only**. It does NOT store:
- Raw text input from users
- Audio files or voice recordings
- Full playlist track lists
- User personal information (beyond Spotify user ID)

---

## Tables

### 1. `sessions` Table

**Purpose:** Track each mood analysis and playlist creation session.

**Fields:**

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique session identifier |
| `user_id` | VARCHAR(255) | NOT NULL, INDEXED | Spotify user ID |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Session creation timestamp |
| `mood_label` | VARCHAR(100) | NOT NULL | Analyzed mood label (e.g., "Energetic & Happy") |
| `sentiment_score` | DECIMAL(3,2) | NOT NULL, CHECK (-1.00 <= sentiment_score <= 1.00) | Sentiment score from LLM (-1 to 1) |
| `energy_score` | INTEGER | NOT NULL, CHECK (energy_score >= 1 AND energy_score <= 10) | Energy level (1-10) |
| `valence_score` | INTEGER | NOT NULL, CHECK (valence_score >= 1 AND valence_score <= 10) | Valence/positivity (1-10) |
| `suggested_genres` | TEXT[] | NOT NULL | Array of suggested genres (3-8 genres) |
| `playlist_id` | VARCHAR(255) | NULLABLE, INDEXED | Spotify playlist ID (if creation succeeded) |
| `playlist_track_count` | INTEGER | NULLABLE | Number of tracks in playlist |
| `input_method` | VARCHAR(20) | NOT NULL, CHECK (input_method IN ('text', 'voice')) | How user provided input |

**Indexes:**
- Primary key on `id`
- Index on `user_id` (for user-specific queries)
- Index on `created_at` (for time-based queries)
- Index on `playlist_id` (for playlist lookups)
- Index on `mood_label` (for mood frequency queries)

**Example Row:**
```sql
id: '550e8400-e29b-41d4-a716-446655440000'
user_id: 'spotify_user_12345'
created_at: '2024-01-15 14:30:00'
mood_label: 'Energetic & Happy'
sentiment_score: 0.75
energy_score: 8
valence_score: 7
suggested_genres: ['pop', 'electronic', 'dance', 'indie-pop']
playlist_id: '37i9dQZF1DXcBWIGoYBM5M'
playlist_track_count: 25
input_method: 'voice'
```

---

## Optional Tables (If Needed)

### 2. `users` Table (If Not Using Supabase Auth)

**Purpose:** Store basic user information if not using Supabase's built-in auth.

**Fields:**

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| `spotify_user_id` | VARCHAR(255) | PRIMARY KEY | Spotify user ID |
| `display_name` | VARCHAR(255) | NULLABLE | User's display name from Spotify |
| `email` | VARCHAR(255) | NULLABLE | User's email (if available) |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation timestamp |
| `last_active_at` | TIMESTAMP | NULLABLE | Last session timestamp |

**Note:** If using Supabase Auth or NextAuth.js with JWT, this table may not be needed.

---

## Analytics Queries Required

The schema must support the following analytics queries:

### 1. Total Sessions
```sql
SELECT COUNT(*) FROM sessions WHERE user_id = ?;
```

### 2. Mood Frequencies
```sql
SELECT mood_label, COUNT(*) as frequency 
FROM sessions 
WHERE user_id = ? 
GROUP BY mood_label 
ORDER BY frequency DESC;
```

### 3. Average Energy Score
```sql
SELECT AVG(energy_score) as avg_energy 
FROM sessions 
WHERE user_id = ?;
```

### 4. Genre Distribution
```sql
SELECT unnest(suggested_genres) as genre, COUNT(*) as frequency
FROM sessions
WHERE user_id = ?
GROUP BY genre
ORDER BY frequency DESC;
```

### 5. Recent Sessions
```sql
SELECT id, created_at, mood_label, playlist_id, playlist_track_count
FROM sessions
WHERE user_id = ?
ORDER BY created_at DESC
LIMIT 10;
```

---

## Data Retention Policy

**Status:** ⚠️ **NEEDS CLARIFICATION**

**Questions:**
- How long should analytics data be retained?
- Should old data be automatically deleted?
- Should users be able to delete their own data?

**Proposed Policy:**
- Retain data indefinitely (unless user deletes)
- Allow users to delete their own sessions
- Option to anonymize data after X days

---

## Privacy & Security Considerations

### Data Minimization
- Only store analytics data, not raw inputs
- Store Spotify user ID only (not email/name unless needed)
- No PII beyond what's necessary

### Access Control
- Users can only access their own analytics
- Implement Row Level Security (RLS) if using Supabase
- Use parameterized queries to prevent SQL injection

### Data Deletion
- Provide endpoint to delete user's analytics
- Cascade delete if user account is deleted
- Comply with GDPR right to be forgotten

---

## Migration Strategy

### Initial Schema Creation
1. Create `sessions` table with all fields
2. Create indexes for performance
3. Set up constraints and checks
4. Test with sample data

### Future Migrations
- Add fields only if needed (avoid breaking changes)
- Use migration tools (Supabase migrations or custom)
- Test migrations in development first

---

## Database Provider Specific Notes

### Supabase
- Use Supabase's migration system
- Leverage Row Level Security (RLS) policies
- Use Supabase client library for queries
- Consider using Supabase Auth (optional)

### Neon
- Use standard PostgreSQL migrations
- Implement application-level access control
- Use connection pooling for serverless
- Set up automated backups

---

## Schema Validation Rules

### Application-Level Validation
- Validate `sentiment_score` is between -1 and 1
- Validate `energy_score` and `valence_score` are 1-10
- Validate `suggested_genres` array has 3-8 items
- Validate `input_method` is 'text' or 'voice'
- Validate `mood_label` is not empty

### Database-Level Constraints
- Use CHECK constraints for score ranges
- Use NOT NULL for required fields
- Use appropriate data types (UUID, TIMESTAMP, etc.)
- Use array type for genres (PostgreSQL native)

---

## Example Schema Creation (PostgreSQL)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create sessions table
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    mood_label VARCHAR(100) NOT NULL,
    sentiment_score DECIMAL(3,2) NOT NULL CHECK (sentiment_score >= -1.00 AND sentiment_score <= 1.00),
    energy_score INTEGER NOT NULL CHECK (energy_score >= 1 AND energy_score <= 10),
    valence_score INTEGER NOT NULL CHECK (valence_score >= 1 AND valence_score <= 10),
    suggested_genres TEXT[] NOT NULL,
    playlist_id VARCHAR(255),
    playlist_track_count INTEGER,
    input_method VARCHAR(20) NOT NULL CHECK (input_method IN ('text', 'voice'))
);

-- Create indexes
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_created_at ON sessions(created_at);
CREATE INDEX idx_sessions_playlist_id ON sessions(playlist_id);
CREATE INDEX idx_sessions_mood_label ON sessions(mood_label);

-- Create index on array for genre queries (GIN index)
CREATE INDEX idx_sessions_genres ON sessions USING GIN(suggested_genres);
```

---

## Notes

- Schema is designed for analytics only (no raw data storage)
- All fields are typed and constrained for data integrity
- Indexes are optimized for common query patterns
- Schema can be extended if needed (with migrations)
- Consider adding `updated_at` field if sessions can be modified

