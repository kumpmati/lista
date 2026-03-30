<script lang="ts">
	import { resolve } from '$app/paths';
	import { getIdbContext, getRootEditorContext } from '$lib/context.js';
	import { AutomergeListEditor } from '$lib/editor/list/automerge.svelte.js';
	import type { ListV2 } from '$lib/types.js';
	import ListEditor from '$lib/ui/ListEditor.svelte';
	import Header from '$lib/ui/layout/Header.svelte';
	import Main from '$lib/ui/layout/Main.svelte';
	import { Repo, type AutomergeUrl } from '@automerge/automerge-repo';
	import { WebSocketClientAdapter } from '@automerge/automerge-repo-network-websocket';
	import { document } from '@automerge/automerge-repo-svelte-store';
	import { ArrowLeft } from '@lucide/svelte';
	import { Button, Dialog, TextFieldOutlined } from 'm3-svelte';
	import { untrack } from 'svelte';

	let { params } = $props();

	let titleEditOpen = $state(false);
	let titleDraft = $state<string>('');

	const root = getRootEditorContext();
	const idb = getIdbContext();

	const repo = new Repo({
		storage: idb, // use same IDB instance as root document
		network: [new WebSocketClientAdapter('wss://sync.automerge.org')], // TODO: host own sync server

		// don't broadcast new documents with other peers.
		shareConfig: {
			announce: async () => false, // don't announce new documents to other peers
			access: async () => true // any peer that knows the document ID can access documents
		}
	});

	const doc = $derived(await document<ListV2>(params.listId as AutomergeUrl, repo));
	const editor = $derived(new AutomergeListEditor(doc!));

	$effect(() => {
		if (!doc || root.loading) return;

		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		editor.current;

		untrack(() => {
			root.syncMeta(doc.documentId, editor.current);
		});
	});

	const showTitleEdit = () => {
		titleEditOpen = true;
		titleDraft = editor.current.meta.title.toString();
	};

	const cancelTitleEdit = () => {
		titleEditOpen = false;
	};

	const saveTitleEdit = async () => {
		if (!titleDraft || !doc) return;

		await editor.setTitle(titleDraft);
		await root.syncMeta(doc!.documentId, editor.current);

		titleEditOpen = false;
	};
</script>

<svelte:head>
	<title>{editor.current.meta.title}</title>
</svelte:head>

<Main>
	<Dialog headline="Edit title" bind:open={titleEditOpen}>
		<form id="edit-title" method="dialog" onsubmit={saveTitleEdit}>
			<TextFieldOutlined name="title" required label="Title" bind:value={titleDraft} />
		</form>

		{#snippet buttons()}
			<Button form="edit-title" variant="tonal" type="button" onclick={cancelTitleEdit}>
				Cancel
			</Button>
			<Button form="edit-title" type="submit">Save</Button>
		{/snippet}
	</Dialog>

	<Header>
		<Button iconType="full" href={resolve('/')} variant="text">
			<ArrowLeft />
		</Button>

		<button class="heading-title m3-layer" onclick={showTitleEdit}>
			<h1>{editor.current.meta.title.toString()}</h1>
		</button>
	</Header>

	<ListEditor {editor} />
</Main>

<style>
	.heading-title {
		background-color: transparent;
		padding-inline: 0.5rem;
		border-radius: 4px;
		align-self: stretch;
	}

	h1 {
		font-size: 20px;
		font-weight: bold;
		color: var(--m3c-primary);
	}
</style>
