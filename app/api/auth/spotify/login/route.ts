import { getSpotifyAuthUrl } from "@/lib/spotifyAuth";

export async function GET() {
  const authUrl = getSpotifyAuthUrl();
  return Response.redirect(authUrl);
}

