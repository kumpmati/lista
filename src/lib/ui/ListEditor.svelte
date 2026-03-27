<script lang="ts">
	import type { ListEditor } from '$lib/interface';
	import { flip } from 'svelte/animate';
	import ListItemRowEdit from './components/ListItemRowEdit.svelte';
	import { wrap } from '$lib/wrap.svelte';
	import ListItemRow from './components/ListItemRow.svelte';
	import { Button } from 'm3-svelte';
	import { Plus } from '@lucide/svelte';
	import type { ListItemV2 } from '$lib/types';

	let { editor }: { editor: ListEditor } = $props();

	let editing = $state<string | null>(null);
	let newItem = $state<{ amount: number; text: string } | null>(null);

	const handleCreateItem = wrap(async (item: Omit<ListItemV2, 'id'>) => {
		await editor.addItem(item);
	});

	const handleToggleItem = wrap(
		async (id: string, status: boolean) => {
			await editor.updateItem(id, { done: status });
		},
		(id) => id // group pending status by item
	);

	const handleUpdateItem = wrap(
		async (id: string, amount: number, text: string) => {
			await editor.updateItem(id, { amount, text });
		},
		(id) => id // group pending status by item
	);

	const handleDeleteItem = wrap(
		async (id: string) => {
			await editor.removeItem(id);
		},
		(id) => id // group pending status by item
	);
</script>

<ul>
	{#each editor.current.items as item (item.id)}
		<li animate:flip={{ duration: 150 }}>
			{#if editing === item.id && !newItem}
				<ListItemRowEdit
					amount={item.amount}
					text={item.text}
					onSave={async (amount, text) => {
						editing = null;
						handleUpdateItem.run(item.id, amount, text);
					}}
					onCancel={() => (editing = null)}
					onDelete={() => handleDeleteItem.run(item.id)}
				/>
			{:else}
				<ListItemRow
					disabled={handleUpdateItem.pending.has(item.id) || handleToggleItem.pending.has(item.id)}
					itemId={item.id}
					done={item.done}
					text={item.text}
					amount={item.amount}
					onLongPress={() => (editing = item.id)}
					onToggle={(done) => handleToggleItem.run(item.id, done)}
				/>
			{/if}
		</li>
	{/each}

	{#if newItem}
		<ListItemRowEdit
			amount={newItem.amount}
			text={newItem.text}
			onSave={async (amount, text) => {
				await handleCreateItem.run({ amount, text, groupId: null, done: false });
				newItem = null;
			}}
			onCancel={() => (newItem = null)}
			onDelete={() => (newItem = null)}
		/>
	{/if}
</ul>

<div class="buttons">
	<Button
		variant="text"
		onclick={() => (newItem = { amount: 1, text: '' })}
		disabled={handleCreateItem.pending.size > 0}
		iconType="left"
	>
		<Plus />
		Item
	</Button>
</div>

<style>
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
