<script lang="ts">
	import '../normalize.css';
	import '../m3-theme.css';
	import '../layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onDestroy } from 'svelte';
	import { Snackbar } from 'm3-svelte';
	import PwaMeta from '$lib/pwa/PwaMeta.svelte';
	import OfflineNotify from '$lib/pwa/OfflineNotify.svelte';
	import { useViewTransitions } from '$lib/utils/viewTransitions.js';
	import { IsMobile } from '$lib/utils/mobile.svelte.js';
	import { setIsMobileContext } from '$lib/context.js';

	let { children, data } = $props();

	onDestroy(() => data.root.cleanup());

	useViewTransitions();

	const mobile = new IsMobile();
	setIsMobileContext(mobile);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<OfflineNotify />
<PwaMeta />
<Snackbar />

{@render children()}
