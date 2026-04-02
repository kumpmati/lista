<script lang="ts">
	import { Button, Dialog, TextFieldOutlined } from 'm3-svelte';

	type Props = {
		title: string;
		open?: boolean;
		onchange: (newTitle: string) => void | Promise<void>;
	};

	let { title, open = $bindable(false), onchange }: Props = $props();

	let titleDraft = $state<string>('');

	const showTitleEdit = () => {
		open = true;
		titleDraft = title;
	};

	const cancelTitleEdit = () => {
		open = false;
	};

	const saveTitleEdit = async (e: Event) => {
		if (!titleDraft) return;
		e.preventDefault();

		await onchange(titleDraft);
		open = false;
	};
</script>

<Dialog headline="Edit title" bind:open>
	<form id="edit-title" method="dialog" onsubmit={saveTitleEdit}>
		<TextFieldOutlined name="title" required label="Title" bind:value={titleDraft} />
	</form>

	{#snippet buttons()}
		<Button form="edit-title" variant="tonal" type="button" onclick={cancelTitleEdit}>
			Cancel
		</Button>
		<Button form="edit-title" type="submit">Save</Button>
	{/snippet}
</Dialog>

<button class="heading-title m3-layer" onclick={showTitleEdit}>
	<h1>{title}</h1>
</button>

<style>
	.heading-title {
		background-color: transparent;
		padding-inline: 0.5rem;
		border-radius: 4px;
		align-self: stretch;
		text-align: left;
	}

	h1 {
		font-size: 20px;
		font-weight: bold;
		color: var(--m3c-primary);
	}
</style>
