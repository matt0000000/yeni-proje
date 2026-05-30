import { json, error } from '@sveltejs/kit';
import { TMDB_API_KEY } from '$env/static/private';

const BASE = 'https://api.themoviedb.org/3';

export async function GET({ url }) {
	const id = url.searchParams.get('id');
	const type = url.searchParams.get('type'); // 'movie' | 'tv'

	if (!id || !type) throw error(400, 'id ve type gerekli');

	const [providersRes, detailRes] = await Promise.all([
		fetch(`${BASE}/${type}/${id}/watch/providers?api_key=${TMDB_API_KEY}`),
		fetch(`${BASE}/${type}/${id}?language=tr-TR&api_key=${TMDB_API_KEY}`)
	]);

	if (!providersRes.ok || !detailRes.ok) throw error(502, 'TMDB API hatası');

	const providers = await providersRes.json();
	const detail = await detailRes.json();

	return json({
		tr: providers.results?.TR ?? null,
		detail
	});
}
