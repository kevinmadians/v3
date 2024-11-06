import { searchSpotifyTracks } from '@/lib/spotify';

// For static export, we'll handle this client-side instead
export async function GET() {
  return new Response('API routes are not supported in static exports', { status: 404 });
}