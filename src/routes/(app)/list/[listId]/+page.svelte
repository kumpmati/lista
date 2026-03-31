<script lang="ts">
	import { resolve } from '$app/paths';
	import ListEditor from '$lib/ui/ListEditor.svelte';
	import Header from '$lib/ui/layout/Header.svelte';
	import Main from '$lib/ui/layout/Main.svelte';
	import { ArrowLeft } from '@lucide/svelte';
	import { Button, Dialog, TextFieldOutlined } from 'm3-svelte';
	import { untrack } from 'svelte';

	let { data } = $props();

	let titleEditOpen = $state(false);
	let titleDraft = $state<string>('');

	let doc = $derived(data.doc);
	let editor = $derived(data.editor);

	$effect(() => {
		// keep root doc in sync when editing list
		data.root.syncMeta(
			untrack(() => doc.url),
			editor.current
		);
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
		await data.root.syncMeta(doc!.url, editor.current);

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
