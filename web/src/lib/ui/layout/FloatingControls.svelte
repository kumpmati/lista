<script lang="ts">
	import { getIsMobileContext } from '$lib/context';
	import type { Snippet } from 'svelte';

	type Props = {
		children?: Snippet;
	};

	let { children }: Props = $props();

	const mobile = getIsMobileContext();
</script>

<div class:mobile={mobile.current}>
	{@render children?.()}
</div>

<style>
	div {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		z-index: 2;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		&.mobile {
			align-items: center;
		}

		&:not(.mobile) {
			align-items: end;
			bottom: 2rem;
			right: 2rem;
		}
	}
</style>
