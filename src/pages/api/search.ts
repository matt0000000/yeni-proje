import type { APIRoute } from 'astro';

const BASE = 'https://api.themoviedb.org/3';

export const GET: APIRoute = async ({ url }) => {
  const q = url.searchParams.get('q');
  if (!q?.trim()) return Response.json({ results: [] });

  const key = import.meta.env.TMDB_API_KEY;
  const res = await fetch(
    `${BASE}/search/multi?query=${encodeURIComponent(q)}&language=tr-TR&region=TR&include_adult=false&api_key=${key}`
  );

  if (!res.ok) return new Response('TMDB hatası', { status: 502 });

  const data = await res.json();
  const results = data.results
    .filter((r: any) => r.media_type === 'movie' || r.media_type === 'tv')
    .slice(0, 20);

  return Response.json({ results });
};
