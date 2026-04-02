<script lang="ts">
	import { wrap } from '$lib/utils/wrap.svelte';
	import { ListPlus } from '@lucide/svelte';
	import { Button, Dialog, TextFieldOutlined } from 'm3-svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		headline: string;
		children?: Snippet;
		open: boolean;
		onCreate: (text: string) => void | Promise<void>;
	};

	let { headline, children, open = $bindable(), onCreate }: Props = $props();

	let groupTitle = $state('');

	const handleCancel = () => {
		open = false;
		groupTitle = '';
	};

	const handleConfirm = wrap(async (e: Event) => {
		e.preventDefault();
		await onCreate(groupTitle);
		handleCancel();
	});
</script>

<Dialog bind:open {headline}>
	<form id="create-group-form" method="dialog" onsubmit={handleConfirm.run} onreset={handleCancel}>
		{@render children?.()}
		<TextFieldOutlined label="Group name" required bind:value={groupTitle} />
	</form>

	{#snippet buttons()}
		<Button form="create-group-form" variant="tonal" type="reset">Cancel</Button>
		<Button
			type="submit"
			form="create-group-form"
			variant="filled"
			iconType="left"
			disabled={handleConfirm.pending.size > 0}
		>
			<ListPlus />
			Create
		</Button>
	{/snippet}
</Dialog>

<style>
	#create-group-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
