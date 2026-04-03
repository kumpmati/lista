<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Logo from '$lib/ui/components/Logo.svelte';
	import NewListButton from '$lib/ui/components/NewListButton.svelte';
	import RootItem from '$lib/ui/components/RootItem.svelte';
	import DeleteDialog from '$lib/ui/dialogs/DeleteDialog.svelte';
	import Footer from '$lib/ui/layout/Footer.svelte';
	import Header from '$lib/ui/layout/Header.svelte';
	import Main from '$lib/ui/layout/Main.svelte';
	import { sortByLastUpdated, sortByPinned } from '$lib/utils/sort.js';
	import { wrap } from '$lib/utils/wrap.svelte.js';
	import { X } from '@lucide/svelte';
	import { Menu, MenuItem, snackbar, SplitButton } from 'm3-svelte';
	import { flip } from 'svelte/animate';
	import { SvelteSet } from 'svelte/reactivity';

	let { data } = $props();

	let deleteDialogOpen = $state(false);
	let isSelecting = $state(false);
	const selected = new SvelteSet<string>();

	let sortedItems = $derived(
		data.root.current.items.toSorted(sortByLastUpdated).toSorted(sortByPinned)
	);

	const handleCreateList = wrap(async () => {
		const item = await data.root.addList();
		await goto(resolve('/(app)/list/[listId]', { listId: item.id }));

		snackbar('Created new list', undefined, true);
	});

	const handleImportList = wrap(async (listId: string) => {
		await goto(resolve('/(app)/list/[listId]', { listId }));
	});

	const handleDeleteSelected = async () => {
		const num = selected.size;
		await Promise.allSettled(selected.values().map((id) => data.root.removeList(id)));

		handleStopSelect();

		snackbar(`Deleted ${num} lists`, undefined, true);
	};

	const handleStartSelect = (id: string) => {
		isSelecting = true;
		selected.clear();
		selected.add(id);
	};

	const handleStopSelect = () => {
		isSelecting = false;
	};

	const handleSetSelected = (id: string, value: boolean) => {
		if (!value) {
			selected.delete(id);
		} else {
			selected.add(id);
		}
	};

	const handleSelectAll = () => {
		data.root.current.items.forEach((item) => handleSetSelected(item.id, true));
	};

	const handleSelectNone = () => {
		selected.clear();
	};

	const handleSetPinToSelected = async (pinned: boolean) => {
		await Promise.allSettled(selected.values().map((id) => data.root.setPinned(id, pinned)));

		if (pinned) {
			snackbar(`Pinned ${selected.size} lists`);
		} else {
			snackbar(`Unpinned ${selected.size} lists`);
		}
	};
</script>

<svelte:head>
	<title>Lista</title>
</svelte:head>

<DeleteDialog
	bind:open={deleteDialogOpen}
	headline="Confirm deletion"
	onDelete={handleDeleteSelected}
>
	Permanently delete {selected.size} lists? This cannot be undone.
</DeleteDialog>

<Main>
	<Header>
		{#if isSelecting}
			<h1>{selected.size} Selected</h1>

			<div style="margin-left: auto;">
				<SplitButton
					onclick={handleStopSelect}
					variant="tonal"
					x="right"
					y="down"
					title="Stop selecting"
				>
					<X stroke-linecap="square" />

					{#snippet menu()}
						<Menu>
							<MenuItem onclick={handleSelectAll}>Select all</MenuItem>
							<MenuItem onclick={handleSelectNone}>Select none</MenuItem>
							<MenuItem onclick={() => handleSetPinToSelected(true)} disabled={!selected.size}>
								Pin
							</MenuItem>
							<MenuItem onclick={() => handleSetPinToSelected(false)} disabled={!selected.size}>
								Unpin
							</MenuItem>
							<MenuItem onclick={() => (deleteDialogOpen = true)} disabled={!selected.size}>
								Delete
							</MenuItem>
						</Menu>
					{/snippet}
				</SplitButton>
			</div>
		{:else}
			<h1>
				<Logo /> My lists
			</h1>

			<NewListButton
				onclick={handleCreateList.run}
				onImport={(id) => handleImportList.run(id)}
				disabled={handleCreateList.pending.size > 0 || handleImportList.pending.size > 0}
			/>
		{/if}
	</Header>

	<ul class="list">
		{#each sortedItems as item (item.id)}
			<li animate:flip={{ duration: 150 }}>
				<RootItem
					isSelectable={isSelecting}
					isSelected={selected.has(item.id)}
					id={item.id}
					title={item.title}
					description={item.description}
					isPublic={item.public}
					pinned={item.pinned ?? false}
					updatedAt={item.updatedAt}
					onLongPress={() => handleStartSelect(item.id)}
					onToggleSelect={(val) => handleSetSelected(item.id, val)}
				/>
			</li>
		{:else}
			<li>No lists yet.</li>
		{/each}
	</ul>
</Main>

<Footer />

<style>
	h1 {
		display: flex;
		align-items: center;
		gap: 0.3em;
		font-size: 20px;
		font-weight: bold;
		color: var(--m3c-primary);
		user-select: none;
	}

	.list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 0.5rem;
		padding: 1rem;
		margin-bottom: 2rem;
	}

	li {
		display: block;
	}
</style>
