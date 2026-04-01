<script lang="ts">
	import { pwaInfo } from 'virtual:pwa-info';
	import { pwaAssetsHead } from 'virtual:pwa-assets/head';
	import { useRegisterSW } from 'virtual:pwa-register/svelte';
	import { snackbar } from 'm3-svelte';

	useRegisterSW({
		immediate: true,
		onOfflineReady: () => snackbar('App is ready to work offline', undefined, true),
		onRegisterError: (err) =>
			snackbar('Service Worker registration failed: ' + err, undefined, true)
	});
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html pwaInfo ? pwaInfo.webManifest.linkTag : ''}

	{#if pwaAssetsHead.themeColor}
		<meta name="theme-color" content={pwaAssetsHead.themeColor.content} />
	{/if}

	{#each pwaAssetsHead.links as link (link.id)}
		<link {...link} />
	{/each}
</svelte:head>
