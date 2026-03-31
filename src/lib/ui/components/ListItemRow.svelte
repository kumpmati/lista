<script lang="ts">
	import { Checkbox } from 'm3-svelte';
	import { usePress } from 'svelte-gestures';

	type Props = {
		disabled?: boolean;
		itemId: string;
		done: boolean;
		amount: number;
		text: string;
		onToggle: (done: boolean) => Promise<unknown>;
		onLongPress: () => void;
	};

	let { disabled, amount, done, text, ...props }: Props = $props();

	let checked = $derived(done);

	const press = usePress(
		() => !disabled && props.onLongPress(),
		() => ({ timeframe: 300, triggerBeforeFinished: true })
	);

	const handleToggle = async () => {
		if (disabled) return;

		const newStatus = checked;

		checked = newStatus; // optimistic update

		await props.onToggle(newStatus);
	};
</script>

<div class="item m3-layer" class:disabled {...press}>
	<label>
		<Checkbox>
			<input type="checkbox" bind:checked {disabled} onchange={() => handleToggle()} />
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
