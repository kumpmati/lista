<script lang="ts">
	import type { Snippet } from 'svelte';

	let props: { children: Snippet } = $props();
</script>

<main>
	<div class="content">
		{@render props.children()}
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		margin: 0 auto;

		/* extend to bottom of screen so that (optional) footer isn't visible by default, only after scrolling. */
		min-block-size: 100svh;
	}

	.content {
		overflow: clip; /* preserves position: sticky */
		background-color: var(--background);
	}

	@media screen and (width >= 40rem) {
		main {
			max-width: 36rem;
			width: calc(100% - 2rem);

			margin-top: 3rem;
			margin-bottom: 3rem;

			min-block-size: calc(100svh - 6rem);
		}

		.content {
			border-radius: 1rem;
			background-color: var(--m3c-surface);
		}
	}
</style>
