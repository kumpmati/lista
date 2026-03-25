<script lang="ts">
	import { resolve } from '$app/paths';
	import { getListById } from '$lib/queries/list.remote.js';
	import { createListItem, deleteListItem, updateListItem } from '$lib/queries/listItem.remote.js';
	import type { ListItem } from '$lib/server/db/schema.js';
	import ListItemRow from '$lib/ui/components/ListItemRow.svelte';
	import ListItemRowEdit from '$lib/ui/components/ListItemRowEdit.svelte';
	import Header from '$lib/ui/layout/Header.svelte';
	import Main from '$lib/ui/layout/Main.svelte';
	import { wrap } from '$lib/wrap.svelte.js';
	import { ArrowLeft, Plus } from '@lucide/svelte';
	import { Button } from 'm3-svelte';

	let { params } = $props();

	let editing = $state<string | null>(null);

	const list = $derived(await getListById(params.listId));

	const handleCreateItem = wrap(async () => {
		await createListItem({ listId: list.id, amount: 1, text: 'Lorem ipsum' }).updates(
			getListById(params.listId)
		);
	});

	const handleUpdateItem = wrap(
		async (id: string, amount: number, text: string) => {
			await updateListItem({ itemId: id, amount, text }).updates(getListById(params.listId));
		},
		// group pending status by item id
		(id) => id
	);

	const sortOldestFirst = (a: ListItem, b: ListItem) => {
		return a.updatedAt.getTime() - b.updatedAt.getTime();
	};
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
		{#each list.items.toSorted(sortOldestFirst) as item (item.id)}
			<li>
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
						disabled={handleUpdateItem.pending.has(item.id)}
						itemId={item.id}
						status={item.status}
						text={item.text}
						amount={item.amount}
						onLongPress={() => {
							console.log('edit', item.id);
							editing = item.id;
						}}
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
	}
</style>
