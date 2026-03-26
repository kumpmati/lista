<script lang="ts">
	import type { ListItem } from '$lib/server/db/schema';
	import { wrap } from '$lib/wrap.svelte';
	import { Checkbox } from 'm3-svelte';
	import { usePress } from 'svelte-gestures';

	type Props = {
		disabled?: boolean;
		itemId: string;
		status: ListItem['status'];
		amount: number;
		text: string;
		onToggle: (to: ListItem['status']) => Promise<void>;
		onLongPress: () => void;
	};

	let { disabled, amount, status, text, ...props }: Props = $props();

	let checked = $derived(status === 'done');

	const press = usePress(
		() => !disabled && props.onLongPress(),
		() => ({ timeframe: 300, triggerBeforeFinished: true })
	);

	const handleToggle = wrap(async () => {
		if (disabled) return;

		const newStatus = checked ? 'done' : 'todo';

		checked = newStatus === 'done'; // optimistic update

		await props.onToggle(newStatus);
	});
</script>

<div class="item m3-layer" class:disabled {...press}>
	<label>
		<Checkbox>
			<input
				type="checkbox"
				bind:checked
				disabled={disabled || handleToggle.pending.size > 0}
				onchange={() => handleToggle.run()}
			/>
		</Checkbox>
	</label>

	<p class:checked>
		{#if amount !== 1}
			<span>{amount}x</span>
		{/if}

		{text}
	</p>
</div>

<style>
	.item {
		width: 100%;
		display: flex;
		align-items: center;
		padding: 10px 1.5rem;
		height: 3rem;
		line-height: 1;
		position: relative;

		&.disabled {
			opacity: 0.5;
		}
	}

	label {
		display: flex;
		align-items: center;
		line-height: 1;
	}

	span {
		color: var(--m3c-primary);
	}

	p {
		margin-left: 1rem;

		&.checked {
			text-decoration: line-through;
			color: var(--m3c-on-surface-variant);
		}
	}
</style>
