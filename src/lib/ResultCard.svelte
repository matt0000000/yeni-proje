<script>
	let { item, onclick } = $props();

	const IMG = 'https://image.tmdb.org/t/p/w342';
	const title = $derived(item.title ?? item.name ?? 'Bilinmiyor');
	const year = $derived((item.release_date ?? item.first_air_date ?? '').slice(0, 4));
	const typeLabel = $derived(item.media_type === 'movie' ? 'Film' : 'Dizi');
	const poster = $derived(item.poster_path ? IMG + item.poster_path : null);
	const rating = $derived(item.vote_average ? item.vote_average.toFixed(1) : null);
</script>

<button class="card" {onclick} aria-label={title}>
	<div class="poster">
		{#if poster}
			<img src={poster} alt={title} loading="lazy" />
		{:else}
			<div class="no-poster">🎬</div>
		{/if}
		<span class="type-badge">{typeLabel}</span>
		{#if rating && item.vote_count > 10}
			<span class="rating">⭐ {rating}</span>
		{/if}
	</div>
	<div class="info">
		<p class="title">{title}</p>
		{#if year}<p class="year">{year}</p>{/if}
	</div>
</button>

<style>
	.card {
		background: #1a1a1f;
		border: 1.5px solid #22222a;
		border-radius: 10px;
		overflow: hidden;
		cursor: pointer;
		text-align: left;
		transition: transform 0.15s, border-color 0.15s;
		width: 100%;
	}

	.card:hover {
		transform: translateY(-3px);
		border-color: #e50914;
	}

	.poster {
		position: relative;
		aspect-ratio: 2/3;
		background: #111;
		overflow: hidden;
	}

	.poster img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.no-poster {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		font-size: 2.5rem;
		color: #333;
	}

	.type-badge {
		position: absolute;
		top: 0.4rem;
		left: 0.4rem;
		background: rgba(0,0,0,0.75);
		color: #ccc;
		font-size: 0.65rem;
		font-weight: 600;
		padding: 0.2rem 0.45rem;
		border-radius: 4px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.rating {
		position: absolute;
		bottom: 0.4rem;
		right: 0.4rem;
		background: rgba(0,0,0,0.75);
		color: #f0f0f2;
		font-size: 0.7rem;
		padding: 0.2rem 0.45rem;
		border-radius: 4px;
	}

	.info {
		padding: 0.6rem 0.7rem;
	}

	.title {
		font-size: 0.82rem;
		font-weight: 600;
		line-height: 1.3;
		color: #f0f0f2;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.year {
		font-size: 0.72rem;
		color: #666;
		margin-top: 0.25rem;
	}
</style>
