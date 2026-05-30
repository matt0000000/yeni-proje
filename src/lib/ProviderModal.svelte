<script>
	let { item, onclose } = $props();

	const IMG_BASE = 'https://image.tmdb.org/t/p/w342';
	const LOGO_BASE = 'https://image.tmdb.org/t/p/original';

	const title = $derived(item.title ?? item.name ?? 'Bilinmiyor');
	const year = $derived((item.release_date ?? item.first_air_date ?? '').slice(0, 4));
	const backdrop = $derived(
		item.detail?.backdrop_path ? IMG_BASE + item.detail.backdrop_path : null
	);
	const poster = $derived(
		item.poster_path ? IMG_BASE + item.poster_path : null
	);
	const overview = $derived(item.detail?.overview || item.overview || '');
	const hasProviders = $derived(item.providers && Object.keys(item.providers).length > 0);

	const sections = [
		{ key: 'flatrate', label: 'Abonelik (Streaming)' },
		{ key: 'rent', label: 'Kiralık' },
		{ key: 'buy', label: 'Satın Al' },
		{ key: 'free', label: 'Ücretsiz' },
		{ key: 'ads', label: 'Reklamsız Ücretsiz' }
	];

	function trapFocus(node) {
		const focusable = node.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
		const first = focusable[0];
		const last = focusable[focusable.length - 1];

		function handleKeydown(e) {
			if (e.key === 'Escape') onclose();
			if (e.key === 'Tab') {
				if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last?.focus(); } }
				else { if (document.activeElement === last) { e.preventDefault(); first?.focus(); } }
			}
		}

		node.addEventListener('keydown', handleKeydown);
		first?.focus();
		return { destroy: () => node.removeEventListener('keydown', handleKeydown) };
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="overlay" onclick={onclose} onkeydown={(e) => e.key === 'Escape' && onclose()} tabindex="-1">
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div class="modal" role="dialog" aria-modal="true" aria-label={title} onclick={(e) => e.stopPropagation()} use:trapFocus>
		<button class="close" onclick={onclose} aria-label="Kapat">✕</button>

		{#if backdrop}
			<div class="backdrop" style="background-image: url({backdrop})"></div>
		{/if}

		<div class="content">
			<div class="meta">
				{#if poster}
					<img class="poster" src={poster} alt={title} />
				{/if}
				<div class="text">
					<h2>{title}</h2>
					{#if year}<p class="year">{year} · {item.media_type === 'movie' ? 'Film' : 'Dizi'}</p>{/if}
					{#if overview}<p class="overview">{overview}</p>{/if}
				</div>
			</div>

			<div class="providers-section">
				{#if item.loadingProviders}
					<div class="loading-providers">
						<div class="spinner"></div>
						<p>Platform bilgisi yükleniyor…</p>
					</div>
				{:else if !hasProviders}
					<div class="no-providers">
						<span>😔</span>
						<p>Bu içerik şu an Türkiye'de hiçbir platformda mevcut değil.</p>
						{#if item.providers?.link}
							<a href={item.providers.link} target="_blank" rel="noopener noreferrer">TMDB'de gör →</a>
						{/if}
					</div>
				{:else}
					{#each sections as { key, label }}
						{#if item.providers[key]?.length}
							<div class="provider-group">
								<h3>{label}</h3>
								<div class="provider-list">
									{#each item.providers[key] as p}
										<div class="provider" title={p.provider_name}>
											<img
												src={LOGO_BASE + p.logo_path}
												alt={p.provider_name}
												loading="lazy"
											/>
											<span>{p.provider_name}</span>
										</div>
									{/each}
								</div>
							</div>
						{/if}
					{/each}
					{#if item.providers?.link}
						<a class="justwatch-link" href={item.providers.link} target="_blank" rel="noopener noreferrer">
							JustWatch'ta görüntüle →
						</a>
					{/if}
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.85);
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		backdrop-filter: blur(4px);
	}

	.modal {
		background: #16161c;
		border: 1px solid #2a2a35;
		border-radius: 16px;
		width: 100%;
		max-width: 680px;
		max-height: 90vh;
		overflow-y: auto;
		position: relative;
		scrollbar-width: thin;
		scrollbar-color: #333 transparent;
	}

	.close {
		position: absolute;
		top: 1rem;
		right: 1rem;
		z-index: 10;
		background: rgba(0,0,0,0.6);
		border: none;
		color: #f0f0f2;
		font-size: 1rem;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.15s;
	}

	.close:hover { background: #e50914; }

	.backdrop {
		height: 180px;
		background-size: cover;
		background-position: center top;
		border-radius: 16px 16px 0 0;
		mask-image: linear-gradient(to bottom, black 50%, transparent);
		-webkit-mask-image: linear-gradient(to bottom, black 50%, transparent);
	}

	.content {
		padding: 1.5rem;
	}

	.meta {
		display: flex;
		gap: 1.25rem;
		margin-bottom: 2rem;
	}

	.poster {
		width: 100px;
		flex-shrink: 0;
		border-radius: 8px;
		margin-top: -3rem;
		box-shadow: 0 8px 24px rgba(0,0,0,0.5);
	}

	.text h2 {
		font-size: 1.3rem;
		font-weight: 700;
		line-height: 1.2;
		margin-bottom: 0.3rem;
	}

	.year {
		font-size: 0.8rem;
		color: #888;
		margin-bottom: 0.5rem;
	}

	.overview {
		font-size: 0.83rem;
		color: #aaa;
		line-height: 1.5;
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.providers-section { margin-top: 0.5rem; }

	.loading-providers {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding: 2rem;
		color: #666;
	}

	.spinner {
		width: 28px;
		height: 28px;
		border: 3px solid #333;
		border-top-color: #e50914;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin { to { transform: rotate(360deg); } }

	.no-providers {
		text-align: center;
		padding: 2rem;
		color: #666;
	}

	.no-providers span { font-size: 2rem; display: block; margin-bottom: 0.75rem; }
	.no-providers p { font-size: 0.9rem; max-width: 320px; margin: 0 auto 1rem; }
	.no-providers a { color: #e50914; font-size: 0.85rem; }

	.provider-group {
		margin-bottom: 1.5rem;
	}

	.provider-group h3 {
		font-size: 0.78rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #888;
		margin-bottom: 0.75rem;
		padding-bottom: 0.4rem;
		border-bottom: 1px solid #222;
	}

	.provider-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.provider {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4rem;
		width: 72px;
	}

	.provider img {
		width: 56px;
		height: 56px;
		border-radius: 12px;
		object-fit: cover;
		border: 1px solid #2a2a35;
	}

	.provider span {
		font-size: 0.65rem;
		color: #aaa;
		text-align: center;
		line-height: 1.2;
	}

	.justwatch-link {
		display: inline-block;
		margin-top: 0.5rem;
		font-size: 0.8rem;
		color: #e50914;
		text-decoration: none;
	}

	.justwatch-link:hover { text-decoration: underline; }

	@media (max-width: 480px) {
		.meta { flex-direction: column; }
		.poster { width: 80px; margin-top: -2rem; }
	}
</style>
