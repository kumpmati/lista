<script lang="ts">
	import { Trash2 } from '@lucide/svelte';
	import { Button, Dialog } from 'm3-svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		headline: string;
		children: Snippet;
		open: boolean;
		onDelete: () => void;
	};

	let { headline, children, open = $bindable(), onDelete }: Props = $props();

	const handleConfirm = () => {
		onDelete();
		open = false;
	};

	const handleCancel = () => {
		open = false;
	};
</script>

<Dialog {headline} {children} bind:open>
	{#snippet buttons()}
		<Button variant="tonal" onclick={handleCancel}>Cancel</Button>
		<Button onclick={handleConfirm} iconType="left" variant="filled">
			<Trash2 stroke-linecap="square" />
			Delete
		</Button>
	{/snippet}
</Dialog>
