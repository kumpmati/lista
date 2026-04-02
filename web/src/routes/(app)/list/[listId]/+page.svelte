<script lang="ts">
	import { resolve } from '$app/paths';
	import { PUBLIC_ORIGIN } from '$env/static/public';
	import ListEditor from '$lib/ui/ListEditor.svelte';
	import ListTitle from '$lib/ui/components/ListTitle.svelte';
	import MenuContainer from '$lib/ui/components/MenuContainer.svelte';
	import NewGroupButton from '$lib/ui/components/NewGroupButton.svelte';
	import NewGroupDialog from '$lib/ui/dialogs/NewGroupDialog.svelte';
	import ShareDialog from '$lib/ui/dialogs/ShareDialog.svelte';
	import Header from '$lib/ui/layout/Header.svelte';
	import Main from '$lib/ui/layout/Main.svelte';
	import { ArrowLeft, EllipsisVertical } from '@lucide/svelte';
	import { Button, Menu, MenuItem, snackbar } from 'm3-svelte';
	import { onDestroy, untrack } from 'svelte';

	let { params, data } = $props();

	let newGroupMenuOpen = $state(false);
	let shareMenuOpen = $state(false);
	let editMenuOpen = $state(false);

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

	const handleChangeTitle = async (title: string) => {
		if (!doc) return;

		await editor.setTitle(title);
		await data.root.syncMeta(doc!.url, editor.current);
	};

	const handleCheckAll = async () => {
		editMenuOpen = false;
		await editor.batchUpdateItems((item) => (item.done = true));

		snackbar('Checked all items', undefined, true);
	};

	const handleUncheckAll = async () => {
		editMenuOpen = false;
		await editor.batchUpdateItems((item) => (item.done = false));

		snackbar('Unchecked all items', undefined, true);
	};

	// TODO: add confirm dialog
	const handleDeleteCompleted = async () => {
		editMenuOpen = false;

		let n = 0;

		await editor.batchUpdateItems((item, remove) => {
			if (item.done) {
				remove();
				n++;
			}
		});

		snackbar(`Cleared ${n} items`, undefined, true);
	};

	const handleClickShare = async () => {
		if (!editor.current.meta.public) {
			shareMenuOpen = true;
		} else {
			await handleShare();
		}
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

<NewGroupDialog
	headline="Create group"
	bind:open={newGroupMenuOpen}
	onCreate={async (text) => {
		await editor.addGroup(text);
	}}
/>

<Main>
	<Header>
		<Button iconType="full" href={resolve('/')} variant="text">
			<ArrowLeft />
		</Button>

		<ListTitle title={editor.current.meta.title.toString()} onchange={handleChangeTitle} />

		<div class="buttons">
			<NewGroupButton onclick={() => (newGroupMenuOpen = true)} />

			<MenuContainer bind:open={editMenuOpen}>
				{#snippet trigger()}
					<Button iconType="full" variant="text" onclick={() => (editMenuOpen = !editMenuOpen)}>
						<EllipsisVertical />
					</Button>
				{/snippet}

				<Menu>
					<MenuItem onclick={handleClickShare}>
						{editor.current.meta.public ? 'Copy share link' : 'Share list'}
					</MenuItem>
					<MenuItem onclick={handleCheckAll}>Check all</MenuItem>
					<MenuItem onclick={handleUncheckAll}>Uncheck all</MenuItem>
					<MenuItem onclick={handleDeleteCompleted}>Clear completed</MenuItem>
				</Menu>
			</MenuContainer>
		</div>
	</Header>

	<ListEditor {editor} />
</Main>

<style>
	.buttons {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-left: auto;
	}
</style>
