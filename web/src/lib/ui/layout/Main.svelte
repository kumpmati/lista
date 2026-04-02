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
	}

	@media screen and (width >= 40rem) {
		main {
			max-width: 36rem;
			width: calc(100% - 2rem);
			background-color: var(--m3c-surface);
			border-radius: 1rem;
			margin-top: 3rem;
			margin-bottom: 3rem;
		}
	}
</style>
