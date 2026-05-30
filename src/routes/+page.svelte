<script>
	import { tick } from 'svelte';
	import ProviderModal from '$lib/ProviderModal.svelte';
	import ResultCard from '$lib/ResultCard.svelte';

	let query = $state('');
	let results = $state([]);
	let loading = $state(false);
	let selected = $state(null);
	let debounceTimer;

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
</script>

<div class="page">
	<header>
		<div class="logo">
			<span class="logo-icon">▶</span>
			<div>
				<h1>Nerede İzlenir?</h1>
				<p>Türkiye'deki streaming platformlarını keşfet</p>
			</div>
		</div>

		<div class="search-wrap">
			<input
				class="search"
				type="search"
				placeholder="Film veya dizi ara… (örn: Breaking Bad, Inception)"
				bind:value={query}
				oninput={onInput}
				autocomplete="off"
			/>
			{#if loading}
				<span class="spinner"></span>
			{/if}
		</div>
	</header>

	<main>
		{#if results.length === 0 && !loading && !query.trim()}
			<div class="empty-state">
				<span>🎬</span>
				<p>Film veya dizi adı yazarak Türkiye'deki yayın platformlarını öğren.</p>
				<p class="sub">Netflix, Disney+, Gain, BluTV, Amazon Prime ve daha fazlası</p>
			</div>
		{:else if results.length === 0 && !loading && query.trim()}
			<div class="empty-state">
				<span>🔍</span>
				<p>"{query}" için sonuç bulunamadı.</p>
			</div>
		{:else}
			<div class="grid">
				{#each results as item (item.id + item.media_type)}
					<ResultCard {item} onclick={() => openProviders(item)} />
				{/each}
			</div>
		{/if}
	</main>
</div>

{#if selected}
	<ProviderModal item={selected} onclose={() => (selected = null)} />
{/if}

<style>
	.page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1.5rem;
	}

	header {
		margin-bottom: 2.5rem;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1.75rem;
	}

	.logo-icon {
		font-size: 2rem;
		background: linear-gradient(135deg, #e50914, #b20710);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.logo h1 {
		font-size: 1.6rem;
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1.1;
	}

	.logo p {
		font-size: 0.85rem;
		color: #888;
		margin-top: 0.2rem;
	}

	.search-wrap {
		position: relative;
	}

	.search {
		width: 100%;
		padding: 0.875rem 1.25rem;
		font-size: 1rem;
		font-family: inherit;
		background: #1a1a1f;
		border: 1.5px solid #2a2a32;
		border-radius: 12px;
		color: #f0f0f2;
		outline: none;
		transition: border-color 0.2s;
	}

	.search:focus {
		border-color: #e50914;
	}

	.search::placeholder {
		color: #555;
	}

	.spinner {
		position: absolute;
		right: 1rem;
		top: 50%;
		transform: translateY(-50%);
		width: 20px;
		height: 20px;
		border: 2px solid #333;
		border-top-color: #e50914;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to { transform: translateY(-50%) rotate(360deg); }
	}

	.empty-state {
		text-align: center;
		padding: 5rem 1rem;
		color: #666;
	}

	.empty-state span {
		font-size: 3.5rem;
		display: block;
		margin-bottom: 1rem;
	}

	.empty-state p {
		font-size: 1rem;
		max-width: 400px;
		margin: 0 auto 0.5rem;
	}

	.empty-state .sub {
		font-size: 0.82rem;
		color: #444;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 1rem;
	}

	@media (min-width: 600px) {
		.grid {
			grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
		}
	}
</style>
