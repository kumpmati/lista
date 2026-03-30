<script lang="ts">
	import { resolve } from '$app/paths';
	import { AutomergeListEditor } from '$lib/editor/automerge.svelte.js';
	import type { ListV2 } from '$lib/types.js';
	import ListEditor from '$lib/ui/ListEditor.svelte';
	import Header from '$lib/ui/layout/Header.svelte';
	import Main from '$lib/ui/layout/Main.svelte';
	import { Repo, type AutomergeUrl } from '@automerge/automerge-repo';
	import { WebSocketClientAdapter } from '@automerge/automerge-repo-network-websocket';
	import { IndexedDBStorageAdapter } from '@automerge/automerge-repo-storage-indexeddb';
	import { document } from '@automerge/automerge-repo-svelte-store';
	import { ArrowLeft } from '@lucide/svelte';
	import { Button } from 'm3-svelte';

	let { params } = $props();

	const repo = new Repo({
		storage: new IndexedDBStorageAdapter(),
		network: [new WebSocketClientAdapter('wss://sync.automerge.org')] // TODO: host own sync server
	});

	const doc = $derived(await document<ListV2>(params.listId as AutomergeUrl, repo));

	const editor = $derived(new AutomergeListEditor(doc!));
</script>

<svelte:head>
	<title>{editor.current.meta.title}</title>
</svelte:head>

<Main>
	<Header>
		<Button iconType="full" href={resolve('/')} variant="text">
			<ArrowLeft />
		</Button>

		<h1>{editor.current.meta.title}</h1>
	</Header>

	<ListEditor {editor} />
</Main>

<style>
	h1 {
		margin-left: 0.5rem;
		font-size: 20px;
		font-weight: bold;
		color: var(--m3c-primary);
	}
</style>
