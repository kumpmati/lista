<script lang="ts">
	import { resolve } from '$app/paths';
	import { getListById } from '$lib/queries/list.remote.js';
	import {
		createListItem,
		deleteListItem,
		updateListItem,
		updateListItemStatus
	} from '$lib/queries/listItem.remote.js';
	import type { ListItem } from '$lib/server/db/schema.js';
	import ListItemRow from '$lib/ui/components/ListItemRow.svelte';
	import ListItemRowEdit from '$lib/ui/components/ListItemRowEdit.svelte';
	import Header from '$lib/ui/layout/Header.svelte';
	import Main from '$lib/ui/layout/Main.svelte';
	import { wrap } from '$lib/wrap.svelte.js';
	import { ArrowLeft, Plus } from '@lucide/svelte';
	import { Button } from 'm3-svelte';
	import { flip } from 'svelte/animate';

	let { params } = $props();

	const sortCompletedLast = (a: ListItem, b: ListItem) => {
		if (a.status === b.status) {
			return a.createdAt.getTime() - b.createdAt.getTime();
		}

		// sort uncompleted to the top of the list
		return a.status === 'todo' ? -1 : 1;
	};

	let editing = $state<string | null>(null);

	const list = $derived(await getListById(params.listId));
	const sortedItems = $derived(list.items.toSorted(sortCompletedLast));

	const handleCreateItem = wrap(async () => {
		await createListItem({ listId: list.id, amount: 1, text: 'Lorem ipsum' }).updates(
			getListById(params.listId)
		);
	});

	const handleToggleItem = wrap(
		async (id: string, status: ListItem['status']) => {
			await updateListItemStatus({ itemId: id, status }).updates(getListById(params.listId));
		},
		(id) => id // group pending status by item
	);

	const handleUpdateItem = wrap(
		async (id: string, amount: number, text: string) => {
			await updateListItem({ itemId: id, amount, text }).updates(getListById(params.listId));
		},
		(id) => id // group pending status by item
	);
</script>

<svelte:head>
	<title>{list.name}</title>
</svelte:head>

<Main>
	<Header>
		<Button iconType="full" href={resolve('/')} variant="text">
			<ArrowLeft />
		</Button>

		<h1>{list.name}</h1>
	</Header>

	<ul>
		{#each sortedItems as item (item.id)}
			<li animate:flip={{ duration: 150 }}>
				{#if editing === item.id}
					<ListItemRowEdit
						amount={item.amount}
						text={item.text}
						onSave={async (amount, text) => {
							editing = null;
							handleUpdateItem.run(item.id, amount, text);
						}}
						onCancel={() => (editing = null)}
						onDelete={() => deleteListItem(item.id).updates(getListById(params.listId))}
					/>
				{:else}
					<ListItemRow
						disabled={handleUpdateItem.pending.has(item.id) ||
							handleToggleItem.pending.has(item.id)}
						itemId={item.id}
						status={item.status}
						text={item.text}
						amount={item.amount}
						onLongPress={() => (editing = item.id)}
						onToggle={(status) => handleToggleItem.run(item.id, status)}
					/>
				{/if}
			</li>
		{/each}
	</ul>

	<div class="buttons">
		<Button
			variant="text"
			onclick={handleCreateItem.run}
			disabled={handleCreateItem.pending.size > 0}
			iconType="left"
		>
			<Plus />
			Item
		</Button>
	</div>
</Main>

<style>
	h1 {
		margin-left: 0.5rem;
		font-size: 20px;
		font-weight: bold;
		color: var(--m3c-primary);
	}

	.buttons {
		display: flex;
		gap: 1rem;
		align-items: center;
		margin-top: 0.5rem;
		padding: 0 1rem;
	}

	ul {
		margin-top: 1rem;
	}
</style>
