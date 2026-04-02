<script lang="ts">
	import { Share2 } from '@lucide/svelte';
	import { Button, Dialog } from 'm3-svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		open?: boolean;
		onShare: () => void | Promise<void>;
		children: Snippet;
	};

	let { open = $bindable(false), onShare, children }: Props = $props();

	let loading = $state(false);

	const handleConfirm = async () => {
		loading = true;

		try {
			await onShare();
			open = false;
		} finally {
			loading = false;
		}
	};

	const handleCancel = () => {
		open = false;
	};
</script>

<Dialog headline="Share" {children} bind:open>
	{#snippet buttons()}
		<Button variant="tonal" onclick={handleCancel}>Cancel</Button>

		<Button variant="filled" onclick={handleConfirm} iconType="left" disabled={loading}>
			<Share2 />
			Share
		</Button>
	{/snippet}
</Dialog>
