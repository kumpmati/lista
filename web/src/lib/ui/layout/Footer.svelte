<script lang="ts">
	import { version } from '$app/environment';
	import type { Snippet } from 'svelte';

	type Props = {
		children?: Snippet;
		includeVersion?: boolean;
	};

	let { children, includeVersion = true }: Props = $props();
</script>

<footer>
	<div class="content">
		{#if includeVersion}
			<small>Lista {version}</small>
		{/if}

		{@render children?.()}
	</div>
</footer>

<style>
	footer {
		background-color: var(--m3c-surface-container-low);
		width: 100%;
		color: var(--m3c-on-surface-variant);
	}

	.content {
		display: flex;
		width: 100%;
		margin: 0 auto;
		padding: 1rem;
	}

	@media screen and (width >= 40rem) {
		.content {
			max-width: 36rem;
		}
	}
</style>
