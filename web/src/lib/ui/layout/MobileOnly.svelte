<script lang="ts">
	import type { Snippet } from 'svelte';
	let { children, style }: { children: Snippet; style?: string } = $props();
</script>

<div class="mobile-only" {style}>
	{@render children()}
</div>
