import type { APIRoute } from 'astro';

const BASE = 'https://api.themoviedb.org/3';

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get('id');
  const type = url.searchParams.get('type');

  if (!id || !type) return new Response('id ve type gerekli', { status: 400 });

  const key = import.meta.env.TMDB_API_KEY;

  const [providersRes, detailRes] = await Promise.all([
    fetch(`${BASE}/${type}/${id}/watch/providers?api_key=${key}`),
    fetch(`${BASE}/${type}/${id}?language=tr-TR&api_key=${key}`)
  ]);

  if (!providersRes.ok || !detailRes.ok) return new Response('TMDB hatası', { status: 502 });

  const providers = await providersRes.json();
  const detail = await detailRes.json();

  return Response.json({
    tr: providers.results?.TR ?? null,
    detail
  });
};
