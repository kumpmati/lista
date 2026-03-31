<script lang="ts">
	import '../normalize.css';
	import '../m3-theme.css';
	import '../layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onDestroy } from 'svelte';
	import { Snackbar } from 'm3-svelte';

	let { children, data } = $props();

	onDestroy(() => data.root.cleanup());
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Snackbar />
{@render children()}
