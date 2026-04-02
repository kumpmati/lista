<script lang="ts">
	import { useDynamicPress } from '$lib/utils/useDynamicPress';
	import { ChevronUp, Save, Trash2 } from '@lucide/svelte';
	import { Button, Dialog, TextFieldOutlined } from 'm3-svelte';
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';

	type Props = {
		id: string;
		text: string;
		completedItems?: number;
		totalItems?: number;
		children?: Snippet;
		open?: boolean;
		onEdit?: (text: string) => void | Promise<void>;
		onDelete?: () => void | Promise<void>;
	};

	let {
		id,
		text,
		completedItems,
		totalItems,
		children,
		open = $bindable(true),
		onEdit,
		onDelete
	}: Props = $props();

	const completed = $derived(totalItems ? (completedItems ?? 0) >= totalItems : false);

	let editOpen = $state(false);
	let textDraft = $state('');

	const handleOpenEdit = () => {
		textDraft = text;
		editOpen = true;
	};

	const handleCancelEdit = () => {
		editOpen = false;
		textDraft = '';
	};

	const handleSaveEdit = async (e: Event) => {
		if (!textDraft) {
			e.preventDefault();
			return;
		}

		await onEdit?.(textDraft);
	};

	const press = useDynamicPress({
		ontap: () => (open = !open),
		onpress: handleOpenEdit
	});
</script>

<Dialog headline="Edit group" bind:open={editOpen}>
	<form id="group-edit-{id}" method="dialog" onsubmit={handleSaveEdit} onreset={handleCancelEdit}>
		<TextFieldOutlined label="Group name" bind:value={textDraft} required />
	</form>

	{#snippet buttons()}
		{#if onDelete}
			<Button
				title="Delete group and its items"
				variant="text"
				size="s"
				iconType="full"
				style="margin-right: auto;"
				onclick={() => confirm('Delete group and all its items?') && onDelete?.()}
			>
				<Trash2 stroke-linecap="square" />
			</Button>
		{/if}

		<Button form="group-edit-{id}" type="reset" variant="tonal">Cancel</Button>
		<Button form="group-edit-{id}" type="submit">
			<Save stroke-linecap="square" />
			Save
		</Button>
	{/snippet}
</Dialog>

<div class="wrapper" class:open>
	<button class="m3-layer" class:completed {...press}>
		<span>
			<span class="title">{text}</span>
			<small>
				{#if totalItems}
					({completedItems ?? 0}/{totalItems ?? 0})
				{:else}
					(0)
				{/if}
			</small>
		</span>

		<span class="icon" class:flipped={open}>
			<ChevronUp size={18} stroke-linecap="square" />
		</span>
	</button>

	{#if open}
		<div class="content" transition:slide={{ axis: 'y', duration: 200 }}>
			{@render children?.()}
		</div>
	{/if}
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
	}

	.delete-buttons {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 1rem;
	}

	.content {
		padding-bottom: 1.5rem;
	}

	.title {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	button {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: transparent;
		width: 100%;
		font-size: 18px;
		color: var(--m3c-primary);
		font-weight: bold;
		padding-block: 12px;
		padding-inline: 16px;
		user-select: none;
		border-bottom: 1px solid light-dark(rgba(0, 0, 0, 0.1), rgba(255, 255, 255, 0.1));

		transition: color 150ms;

		&.completed {
			color: var(--text-subtle);

			.title {
				text-decoration: line-through;
			}
		}
	}

	small {
		font-weight: normal;
		font-size: 14px;
	}

	.icon {
		display: flex;
		width: fit-content;
		transition: transform 150ms;

		&.flipped {
			transform: rotate(180deg);
		}
	}
</style>
