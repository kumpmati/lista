<script lang="ts">
	import { resolve } from '$app/paths';
	import { PUBLIC_ORIGIN } from '$env/static/public';
	import ListEditor from '$lib/ui/ListEditor.svelte';
	import MenuContainer from '$lib/ui/components/MenuContainer.svelte';
	import ShareDialog from '$lib/ui/dialogs/ShareDialog.svelte';
	import Header from '$lib/ui/layout/Header.svelte';
	import Main from '$lib/ui/layout/Main.svelte';
	import { ArrowLeft, EllipsisVertical } from '@lucide/svelte';
	import { Button, Dialog, Menu, MenuItem, snackbar, TextFieldOutlined } from 'm3-svelte';
	import { onDestroy, untrack } from 'svelte';

	let { params, data } = $props();

	let shareMenuOpen = $state(false);
	let editMenuOpen = $state(false);
	let titleEditOpen = $state(false);
	let titleDraft = $state<string>('');

	let doc = $derived(data.doc);
	let editor = $derived(data.editor);

	onDestroy(() => data.cleanup());

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

	const handleCheckAll = async () => {
		editMenuOpen = false;
		await editor.batchUpdate((item) => (item.done = true));

		snackbar('Checked all items', undefined, true);
	};

	const handleUncheckAll = async () => {
		editMenuOpen = false;
		await editor.batchUpdate((item) => (item.done = false));

		snackbar('Unchecked all items', undefined, true);
	};

	// TODO: add confirm dialog
	const handleDeleteCompleted = async () => {
		editMenuOpen = false;

		let n = 0;

		await editor.batchUpdate((item, remove) => {
			if (item.done) {
				remove();
				n++;
			}
		});

		snackbar(`Cleared ${n} items`, undefined, true);
	};

	const handleShare = async () => {
		const url = `${PUBLIC_ORIGIN}/list/${params.listId}`;

		try {
			await editor.makePublic();
			await navigator.clipboard.writeText(url);
			snackbar('Link copied to clipboard', undefined, true);
		} catch {
			snackbar('Failed to copy share link', undefined, true);
		}
	};
</script>

<svelte:head>
	<title>{editor.current.meta.title}</title>
</svelte:head>

<ShareDialog bind:open={shareMenuOpen} onShare={handleShare}>
	Do you want to share this list? Anyone with the link will be able to edit it.
</ShareDialog>

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

<Main>
	<Header>
		<Button iconType="full" href={resolve('/')} variant="text">
			<ArrowLeft />
		</Button>

		<button class="heading-title m3-layer" onclick={showTitleEdit}>
			<h1>{editor.current.meta.title.toString()}</h1>
		</button>

		<MenuContainer bind:open={editMenuOpen}>
			{#snippet trigger()}
				<Button iconType="full" variant="text" onclick={() => (editMenuOpen = !editMenuOpen)}>
					<EllipsisVertical />
				</Button>
			{/snippet}

			<Menu>
				<MenuItem onclick={() => (shareMenuOpen = true)}>Share list</MenuItem>
				<MenuItem onclick={handleCheckAll}>Check all</MenuItem>
				<MenuItem onclick={handleUncheckAll}>Uncheck all</MenuItem>
				<MenuItem onclick={handleDeleteCompleted}>Clear completed</MenuItem>
			</Menu>
		</MenuContainer>
	</Header>

	<ListEditor {editor} />
</Main>

<style>
	.heading-title {
		background-color: transparent;
		padding-inline: 0.5rem;
		border-radius: 4px;
		align-self: stretch;
		text-align: left;
	}

	h1 {
		font-size: 20px;
		font-weight: bold;
		color: var(--m3c-primary);
	}
</style>
