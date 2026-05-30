<script>
	import ProviderModal from '$lib/ProviderModal.svelte';

	let query = $state('');
	let results = $state([]);
	let loading = $state(false);
	let selected = $state(null);
	let debounceTimer;

	const hasResults = $derived(results.length > 0);
	const searched = $derived(query.trim().length > 0);

	async function search(q) {
		if (!q.trim()) { results = []; return; }
		loading = true;
		try {
			const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
			const data = await res.json();
			results = data.results;
		} finally {
			loading = false;
		}
	}

	function onInput() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => search(query), 350);
	}

	async function openProviders(item) {
		selected = { ...item, providers: null, detail: null, loadingProviders: true };
		const res = await fetch(`/api/providers?id=${item.id}&type=${item.media_type}`);
		const data = await res.json();
		selected = { ...selected, providers: data.tr, detail: data.detail, loadingProviders: false };
	}

	const IMG = 'https://image.tmdb.org/t/p/w92';
</script>

<div class="page" class:has-results={hasResults || searched}>
	<div class="center-wrap">
		<h1 class="logo">nerede<span>izlenir</span></h1>

		<div class="search-wrap">
			<svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
			</svg>
			<input
				class="search"
				type="search"
				placeholder="Film veya dizi ara…"
				bind:value={query}
				oninput={onInput}
				autocomplete="off"
				spellcheck="false"
			/>
			{#if loading}
				<span class="spinner"></span>
			{/if}
		</div>

		{#if hasResults}
			<ul class="results">
				{#each results as item (item.id + item.media_type)}
					{@const title = item.title ?? item.name ?? ''}
					{@const year = (item.release_date ?? item.first_air_date ?? '').slice(0, 4)}
					{@const poster = item.poster_path ? IMG + item.poster_path : null}
					<li>
						<button class="result-row" onclick={() => openProviders(item)}>
							{#if poster}
								<img src={poster} alt="" class="thumb" />
							{:else}
								<div class="thumb thumb-empty">🎬</div>
							{/if}
							<div class="result-text">
								<span class="result-title">{title}</span>
								<span class="result-meta">
									{#if year}{year} · {/if}{item.media_type === 'movie' ? 'Film' : 'Dizi'}
								</span>
							</div>
							<svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="m9 18 6-6-6-6"/>
							</svg>
						</button>
					</li>
				{/each}
			</ul>
		{:else if searched && !loading}
			<p class="empty">"{query}" için sonuç bulunamadı.</p>
		{/if}
	</div>
</div>

{#if selected}
	<ProviderModal item={selected} onclose={() => (selected = null)} />
{/if}

<style>
	.page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 1rem;
		transition: align-items 0.3s;
	}

	.page.has-results {
		align-items: flex-start;
		padding-top: 4rem;
	}

	.center-wrap {
		width: 100%;
		max-width: 580px;
	}

	.logo {
		text-align: center;
		font-size: 2.2rem;
		font-weight: 700;
		letter-spacing: -0.03em;
		margin-bottom: 1.5rem;
		color: #e8e8ea;
	}

	.logo span {
		color: #e50914;
	}

	.page.has-results .logo {
		font-size: 1.4rem;
		margin-bottom: 1rem;
		text-align: left;
	}

	.search-wrap {
		position: relative;
		display: flex;
		align-items: center;
	}

	.search-icon {
		position: absolute;
		left: 1rem;
		width: 18px;
		height: 18px;
		color: #666;
		pointer-events: none;
		flex-shrink: 0;
	}

	.search {
		width: 100%;
		padding: 0.85rem 2.75rem 0.85rem 2.75rem;
		font-size: 1rem;
		font-family: inherit;
		background: #1e1e24;
		border: 1.5px solid #2e2e38;
		border-radius: 9999px;
		color: #f0f0f2;
		outline: none;
		transition: border-color 0.2s, box-shadow 0.2s;
	}

	.search:focus {
		border-color: #444;
		box-shadow: 0 0 0 3px rgba(255,255,255,0.04);
	}

	.search::placeholder { color: #555; }

	.search::-webkit-search-cancel-button { display: none; }

	.spinner {
		position: absolute;
		right: 1.1rem;
		width: 18px;
		height: 18px;
		border: 2px solid #333;
		border-top-color: #e50914;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
		flex-shrink: 0;
	}

	@keyframes spin { to { transform: rotate(360deg); } }

	.results {
		list-style: none;
		margin-top: 0.5rem;
		border: 1px solid #1e1e24;
		border-radius: 16px;
		overflow: hidden;
		background: #111115;
	}

	.results li + li {
		border-top: 1px solid #1e1e24;
	}

	.result-row {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.85rem;
		padding: 0.7rem 1rem;
		background: transparent;
		border: none;
		color: inherit;
		cursor: pointer;
		font-family: inherit;
		text-align: left;
		transition: background 0.12s;
	}

	.result-row:hover {
		background: #18181e;
	}

	.thumb {
		width: 40px;
		height: 60px;
		object-fit: cover;
		border-radius: 5px;
		flex-shrink: 0;
		background: #1a1a1f;
	}

	.thumb-empty {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.1rem;
		background: #1a1a1f;
		color: #444;
	}

	.result-text {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.result-title {
		font-size: 0.92rem;
		font-weight: 500;
		color: #e8e8ea;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.result-meta {
		font-size: 0.75rem;
		color: #666;
	}

	.chevron {
		width: 16px;
		height: 16px;
		color: #444;
		flex-shrink: 0;
	}

	.empty {
		margin-top: 1.5rem;
		text-align: center;
		font-size: 0.9rem;
		color: #555;
	}
</style>
