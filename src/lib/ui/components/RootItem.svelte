<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Share2 } from '@lucide/svelte';
	import { Checkbox } from 'm3-svelte';
	import { usePress } from 'svelte-gestures';
	import { slide } from 'svelte/transition';

	type Props = {
		isSelectable?: boolean;
		isSelected?: boolean;
		id: string;
		title: string;
		items: number;
		isPublic: boolean;
		onLongPress?: () => void;
		onToggleSelect?: (value: boolean) => void;
	};

	let { isSelectable, isSelected, id, title, items, isPublic, onLongPress, onToggleSelect }: Props =
		$props();

	const press = usePress(
		() => {
			if (!isSelectable) onLongPress?.();
		},
		() => ({ timeframe: 300, triggerBeforeFinished: true })
	);

	let selected = $derived(isSelectable && isSelected);

	const handleClick = async () => {
		if (!isSelectable) {
			goto(resolve('/(app)/list/[listId]', { listId: id }));
			return;
		}

		onToggleSelect?.(!isSelected);
	};
</script>

<button class="m3-layer" class:selected {...press} onclick={handleClick}>
	{#if isSelectable}
		<label transition:slide={{ axis: 'y', duration: 150 }}>
			<Checkbox>
				<input type="checkbox" checked={selected} tabindex="-1" />
			</Checkbox>
		</label>
	{/if}

	{#if isPublic}
		<Share2 style="min-width: 16px; height: 16px; position: absolute; top: 1rem; right: 1rem;" />
	{/if}

	<span class="title">{title}</span>
	<span class="items">{items || 0} items</span>
</button>

<style>
	label {
		user-select: none;
		pointer-events: none;
		margin-bottom: 0.25rem;
		margin-left: auto;
	}

	button {
		display: flex;
		flex-direction: column;
		align-items: start;
		text-decoration: none;
		background-color: transparent;
		text-align: left;
		width: 100%;
		user-select: none;

		padding: 1rem;
		border-radius: 0.75rem;
		background-color: var(--m3c-surface-container);

		transition: box-shadow 150ms;

		&.selected {
			box-shadow: 0 0 0 2px var(--m3c-primary);
		}
	}

	.title {
		font-size: 16px;
		font-weight: bold;
		color: var(--white);

		width: calc(100% - 1rem);

		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	.items {
		color: var(--m3c-primary);
		margin-top: 0.25rem;
		font-size: 14px;
	}
</style>
