<script lang="ts">
	import type { Snippet } from 'svelte';

	let props: { children: Snippet } = $props();
</script>

<main>
	{@render props.children()}
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		margin: 0 auto;
		max-width: 40rem;
	}

	@media screen and (min-width: 40rem) {
		main {
			width: calc(100% - 2rem);
			background-color: var(--m3c-surface-container);
			border-radius: 1rem;
			overflow: clip;
			margin-top: 2rem;
			padding: 1rem;
		}
	}
</style>
