<script lang="ts">
	import '../normalize.css';
	import '../m3-theme.css';
	import '../layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { setContextRepo } from '@automerge/automerge-repo-svelte-store';
	import { Repo } from '@automerge/automerge-repo';
	import { IndexedDBStorageAdapter } from '@automerge/automerge-repo-storage-indexeddb';
	import { WebSocketClientAdapter } from '@automerge/automerge-repo-network-websocket';

	let { children } = $props();

	const repo = new Repo({
		storage: new IndexedDBStorageAdapter(),
		network: [new WebSocketClientAdapter('wss://sync.automerge.org')] // TODO: host own
	});

	setContextRepo(repo);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
