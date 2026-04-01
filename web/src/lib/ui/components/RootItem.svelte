<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Pin, Share2 } from '@lucide/svelte';
	import { Checkbox } from 'm3-svelte';
	import { usePress } from 'svelte-gestures';
	import { slide } from 'svelte/transition';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';

	dayjs.extend(relativeTime);

	type Props = {
		isSelectable?: boolean;
		isSelected?: boolean;
		id: string;
		title: string;
		description: string;
		isPublic: boolean;
		pinned: boolean;
		updatedAt: Date | undefined;
		onLongPress?: () => void;
		onToggleSelect?: (value: boolean) => void;
	};

	let {
		isSelectable,
		isSelected,
		id,
		title,
		description,
		isPublic,
		pinned,
		updatedAt,
		onLongPress,
		onToggleSelect
	}: Props = $props();

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

	<div class="title-row">
		<span class="title">{title}</span>

		{#if isPublic}
			<Share2 style="min-width: 16px; height: 16px; color: var(--m3c-primary)" />
		{/if}
	</div>
	<span class="description">{description}</span>

	<div class="bottom">
		{#if pinned}
			<Pin style="min-width: 12px; width: 12px; height: 12px;" />
		{/if}

		{#if updatedAt}
			<span class="updated-at">{dayjs(updatedAt).fromNow()}</span>
		{/if}
	</div>
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

		transition:
			box-shadow 150ms,
			transform 150ms;

		&.selected {
			box-shadow: 0 0 0 2px var(--m3c-primary);
		}

		&:active {
			transform: scale(0.97);
		}
	}

	.title-row {
		display: flex;
		justify-content: space-between;
		width: 100%;
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

	.description {
		color: var(--m3c-primary);
		margin-top: 0.25rem;
		font-size: 14px;

		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		width: 100%;
	}

	.bottom {
		margin-top: 0.75rem;
		display: flex;
		align-items: center;
		font-size: 12px;
		gap: 4px;
		color: var(--text);
		opacity: 0.5;
		width: 100%;
	}

	.updated-at {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
</style>
