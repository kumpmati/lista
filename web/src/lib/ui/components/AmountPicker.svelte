<script lang="ts">
	import { Minus, Plus } from '@lucide/svelte';
	import { Button } from 'm3-svelte';
	import { fly } from 'svelte/transition';

	type Props = {
		amount: number;
		zeroAsDelete?: boolean;
		onDelete?: () => void;
	};

	let { amount = $bindable(), zeroAsDelete, onDelete }: Props = $props();
</script>

<div>
	<Button
		iconType="full"
		size="s"
		variant="text"
		onclick={() => (amount += 1)}
		style="position: absolute; top: 0; transform: translateY(-100%)"
	>
		<Plus />
	</Button>

	{#key amount}
		<span in:fly={{ y: -10, duration: 150 }}>{amount}</span>
	{/key}

	<Button
		iconType="full"
		size="s"
		variant="text"
		onclick={() => {
			if (zeroAsDelete && amount <= 1) {
				onDelete?.();
			}

			amount = Math.max(amount - 1, zeroAsDelete ? 1 : 0);
		}}
		style="position: absolute; bottom: 0; transform: translateY(100%)"
	>
		<Minus />
	</Button>
</div>

<style>
	div {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	span {
		width: 2.5rem;
		text-align: center;
		font-weight: bold;
		color: var(--m3c-on-surface);
		user-select: none;
	}
</style>
