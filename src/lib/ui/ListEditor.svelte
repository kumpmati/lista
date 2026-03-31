<script lang="ts">
	import type { ListEditor } from '$lib/interface';
	import ListItemRowEdit from './components/ListItemRowEdit.svelte';
	import ListItemRow from './components/ListItemRow.svelte';
	import { Button } from 'm3-svelte';
	import { Plus } from '@lucide/svelte';
	import { ImmutableString } from '@automerge/automerge-repo';
	import { flip } from 'svelte/animate';
	import { sortItemsByStatus } from '$lib/utils/sort';

	let { editor }: { editor: ListEditor } = $props();

	let editing = $state<string | null>(null);
	let newItem = $state<{ amount: number; text: string } | null>(null);

	let sortedItems = $derived(editor.current.items.toSorted(sortItemsByStatus));
</script>

<ul>
	{#each sortedItems as item (item.id)}
		<li animate:flip={{ duration: 150 }}>
			{#if editing === item.id && !newItem}
				<ListItemRowEdit
					amount={item.amount}
					text={item.text.toString()}
					onSave={async (amount, text) => {
						editor.updateItem(item.id, { amount, text: new ImmutableString(text) });
						editing = null;
					}}
					onCancel={() => (editing = null)}
					onDelete={() => editor.removeItem(item.id)}
				/>
			{:else}
				<ListItemRow
					itemId={item.id}
					done={item.done}
					text={item.text.toString()}
					amount={item.amount}
					onLongPress={() => (editing = item.id)}
					onToggle={async (done) => editor.updateItem(item.id, { done })}
				/>
			{/if}
		</li>
	{/each}

	{#if newItem}
		<ListItemRowEdit
			amount={newItem.amount}
			text={newItem.text}
			onSave={async (amount, text) => {
				editor.addItem({ amount, text: new ImmutableString(text), groupId: null, done: false });
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
		disabled={newItem !== null}
		onclick={() => (newItem = { amount: 1, text: '' })}
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
