<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import RootItem from '$lib/ui/components/RootItem.svelte';
	import DeleteDialog from '$lib/ui/DeleteDialog.svelte';
	import Header from '$lib/ui/layout/Header.svelte';
	import Main from '$lib/ui/layout/Main.svelte';
	import { Plus, X } from '@lucide/svelte';
	import { Button, Menu, MenuItem, SplitButton } from 'm3-svelte';
	import { flip } from 'svelte/animate';
	import { SvelteSet } from 'svelte/reactivity';

	let { data } = $props();

	let deleteDialogOpen = $state(false);
	let isSelecting = $state(false);
	const selected = new SvelteSet<string>();

	const handleCreateList = async () => {
		const item = await data.root.addList();
		goto(resolve('/(app)/list/[listId]', { listId: item.id }));
	};

	const handleDeleteSelected = async () => {
		await Promise.allSettled(selected.values().map((id) => data.root.removeList(id)));

		handleStopSelect();
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
			<h1>{selected.size} selected</h1>

			<div style="margin-left: auto;">
				<SplitButton
					onclick={handleStopSelect}
					variant="tonal"
					x="right"
					y="down"
					title="Stop selecting"
				>
					<X />

					{#snippet menu()}
						<Menu>
							<MenuItem onclick={handleSelectAll}>Select all</MenuItem>
							<MenuItem onclick={handleSelectNone}>Select none</MenuItem>
							<MenuItem onclick={() => (deleteDialogOpen = true)} disabled={selected.size === 0}>
								Delete selected
							</MenuItem>
						</Menu>
					{/snippet}
				</SplitButton>
			</div>
		{:else}
			<h1>My lists</h1>

			<Button
				title="Create list"
				variant="filled"
				iconType="full"
				onclick={handleCreateList}
				style="margin-right: .5rem; margin-left: auto;"
			>
				<Plus />
			</Button>
		{/if}
	</Header>

	<ul class="list">
		{#each data.root.current.items as item (item.id)}
			<li animate:flip={{ duration: 150 }}>
				<RootItem
					isSelectable={isSelecting}
					isSelected={selected.has(item.id)}
					id={item.id}
					title={item.title}
					items={item.items}
					isPublic={item.public}
					onLongPress={() => handleStartSelect(item.id)}
					onToggleSelect={(val) => handleSetSelected(item.id, val)}
				/>
			</li>
		{:else}
			<li>No lists yet.</li>
		{/each}
	</ul>
</Main>

<style>
	h1 {
		margin-left: 0.5rem;
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
	}

	li {
		display: block;
	}
</style>
