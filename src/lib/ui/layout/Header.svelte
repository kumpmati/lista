<script lang="ts">
	import type { Snippet } from 'svelte';
	let props: { children: Snippet } = $props();
</script>

<div>
	{@render props.children()}
</div>

<style>
	div {
		display: flex;
		align-items: stretch;
		padding: 0.5rem;
	}
</style>
