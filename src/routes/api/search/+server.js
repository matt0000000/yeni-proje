import { json, error } from '@sveltejs/kit';
import { TMDB_API_KEY } from '$env/static/private';

const BASE = 'https://api.themoviedb.org/3';

export async function GET({ url }) {
	const query = url.searchParams.get('q');
	if (!query?.trim()) return json({ results: [] });

	const res = await fetch(
		`${BASE}/search/multi?query=${encodeURIComponent(query)}&language=tr-TR&region=TR&include_adult=false&api_key=${TMDB_API_KEY}`
	);

	if (!res.ok) throw error(502, 'TMDB API hatası');

	const data = await res.json();
	const filtered = data.results
		.filter((r) => r.media_type === 'movie' || r.media_type === 'tv')
		.slice(0, 20);

	return json({ results: filtered });
}
