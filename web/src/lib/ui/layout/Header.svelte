<script lang="ts">
	import type { Snippet } from 'svelte';
	let props: { children: Snippet; sticky?: boolean } = $props();
</script>

<div class:sticky={props.sticky}>
	{@render props.children()}
</div>

<style>
	div {
		display: flex;
		align-items: center;
		padding: 1rem;
		z-index: 10;
		border-top-left-radius: 1rem;
		border-top-right-radius: 1rem;

		view-transition-name: header;

		&.sticky {
			position: sticky;
			top: 0;
		}
	}

	@media screen and (width >= 40rem) {
		div.sticky {
			background: linear-gradient(var(--m3c-surface) 33%, transparent);
		}
	}

	@media screen and (width < 40rem) {
		div.sticky {
			background: linear-gradient(var(--background) 33%, transparent);
		}
	}
</style>
