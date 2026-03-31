<script lang="ts">
	import '../normalize.css';
	import '../m3-theme.css';
	import '../layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onDestroy } from 'svelte';

	let { children, data } = $props();

	onDestroy(() => data.root.cleanup());
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
