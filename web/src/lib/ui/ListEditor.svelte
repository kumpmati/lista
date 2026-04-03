<script lang="ts">
	import type { ListEditor } from '$lib/interface';
	import ListItemRowEdit from './components/ListItemRowEdit.svelte';
	import ListItemRow from './components/ListItemRow.svelte';
	import { Button } from 'm3-svelte';
	import { Plus } from '@lucide/svelte';
	import { ImmutableString } from '@automerge/automerge-repo';
	import { flip } from 'svelte/animate';
	import { sortItemsByStatus } from '$lib/utils/sort';
	import Group from './components/Group.svelte';
	import { groupBy } from '$lib/utils/groupBy';
	import type { ListItemV2 } from '$lib/types';
	import EmptyListPlaceholder from './placeholders/EmptyListPlaceholder.svelte';
	import NewGroupDialog from './dialogs/NewGroupDialog.svelte';
	import NewGroupButton from './components/NewGroupButton.svelte';

	let { editor }: { editor: ListEditor } = $props();

	let newGroupMenuOpen = $state(false);
	let editing = $state<string | null>(null);
	let newItem = $state<{ amount: number; text: string; groupId: string | null } | null>(null);

	const GROUP_UNASSIGNED = '';

	let isEmpty = $derived(editor.current.groups.length + editor.current.items.length === 0);

	// TODO: sort items after grouping for better efficiency
	let sortedItems = $derived(editor.current.items.toSorted(sortItemsByStatus));
	let groupedItems = $derived(groupBy(sortedItems, (i) => i.groupId ?? GROUP_UNASSIGNED));

	const handleNewItem = async (amount: number, text: string, groupId: string | null) => {
		editor.addItem({
			amount,
			text: new ImmutableString(text),
			groupId: groupId,
			done: false
		});
		newItem = null;
	};
</script>

{#snippet itemList(items: ListItemV2[])}
	<ul>
		{#each items as item (item.id)}
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
	</ul>
{/snippet}

{#snippet newItemButton(groupId: string | null)}
	{#if newItem?.groupId !== groupId}
		<div class="buttons">
			<Button
				variant="text"
				onclick={() => (newItem = { amount: 1, text: '', groupId })}
				iconType="left"
				size="xs"
				square
			>
				<Plus stroke-linecap="square" />
				Item
			</Button>
		</div>
	{/if}
{/snippet}

<NewGroupDialog
	headline="Create group"
	bind:open={newGroupMenuOpen}
	onCreate={async (text) => {
		await editor.addGroup(text);
	}}
/>

<NewGroupButton onclick={() => (newGroupMenuOpen = true)} />

{#if !isEmpty}
	<div class="wrapper">
		<div class="ungrouped">
			{@render itemList(groupedItems[GROUP_UNASSIGNED] ?? [])}
			{@render newItemButton(null)}

			{#if newItem?.groupId === null}
				<ListItemRowEdit
					amount={newItem.amount}
					text={newItem.text}
					onSave={async (amount, text) => handleNewItem(amount, text, null)}
					onCancel={() => (newItem = null)}
					onDelete={() => (newItem = null)}
				/>
			{/if}
		</div>

		{#each editor.current.groups as group (group.id)}
			{@const items = groupedItems[group.id] ?? []}
			{@const numCompleted = items.filter((i) => i.done).length}

			<Group
				id={group.id}
				text={group.text.toString()}
				totalItems={items.length}
				completedItems={numCompleted}
				onEdit={async (text) => {
					await editor.updateGroup(group.id, { text: new ImmutableString(text) });
				}}
				onDelete={async () => {
					// TODO: allow user to choose if items are deleted?
					await editor.removeGroup(group.id, true);
				}}
			>
				{@render itemList(items)}
				{@render newItemButton(group.id)}

				{#if newItem?.groupId === group.id}
					<ListItemRowEdit
						amount={newItem.amount}
						text={newItem.text}
						onSave={async (amount, text) => handleNewItem(amount, text, group.id)}
						onCancel={() => (newItem = null)}
						onDelete={() => (newItem = null)}
					/>
				{/if}
			</Group>
		{/each}
	</div>
{:else}
	<EmptyListPlaceholder
		onCreateItem={async () => {
			const item = await editor.addItem({
				amount: 1,
				text: new ImmutableString(''),
				groupId: null,
				done: false
			});
			editing = item.id; // TODO: delete newly created empty item if user cancels editing?
		}}
		onCreateGroup={() => {
			newGroupMenuOpen = true;
		}}
	/>
{/if}

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		margin-top: 1rem;
		margin-bottom: 2rem;
	}

	.buttons {
		display: flex;
		gap: 1rem;
		align-items: center;
		margin-top: 0.5rem;
		padding: 0 0.75rem;
	}

	.ungrouped {
		margin-bottom: 1.5rem;
	}
</style>
