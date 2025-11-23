/**
 * Spotify OAuth Authorization URL Helper
 * 
 * Generates the authorization URL for Spotify's Authorization Code flow.
 */

const SCOPES = [
  'playlist-modify-private',
  'playlist-modify-public',
  'user-read-private',
  'user-read-recently-played',
  'user-top-read',
] as const;

/**
 * Generates the Spotify authorization URL for OAuth flow.
 * 
 * @returns The complete authorization URL
 * @throws Error if required environment variables are missing
 */
export function getSpotifyAuthUrl(): string {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!clientId) {
    throw new Error('SPOTIFY_CLIENT_ID environment variable is required');
  }

  if (!redirectUri) {
    throw new Error('SPOTIFY_REDIRECT_URI environment variable is required');
  }

  const scopeParam = SCOPES.join(' ');
  const baseUrl = 'https://accounts.spotify.com/authorize';

  const params = new URLSearchParams();
  params.set('client_id', clientId);
  params.set('response_type', 'code');
  params.set('redirect_uri', redirectUri);
  params.set('scope', scopeParam);

  return `${baseUrl}?${params.toString()}`;
}

