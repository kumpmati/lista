<script lang="ts">
	import { Minus, Plus, Trash2 } from '@lucide/svelte';
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
		size="xs"
		variant="text"
		onclick={() => {
			if (zeroAsDelete && amount <= 1) {
				onDelete?.();
			}

			amount = Math.max(amount - 1, zeroAsDelete ? 1 : 0);
		}}
	>
		{#if amount <= 1 && zeroAsDelete}
			<Trash2 />
		{:else}
			<Minus />
		{/if}
	</Button>

	{#key amount}
		<span in:fly={{ y: -10, duration: 150 }}>{amount}</span>
	{/key}

	<Button iconType="full" size="xs" variant="text" onclick={() => (amount += 1)}>
		<Plus />
	</Button>
</div>

<style>
	div {
		display: flex;
		align-items: center;
	}

	span {
		width: 1.5ch;
		text-align: center;
		font-weight: bold;
		color: var(--m3c-primary);
		user-select: none;
	}
</style>
