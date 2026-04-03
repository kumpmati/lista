<script lang="ts">
	import { Import, Plus } from '@lucide/svelte';
	import { Button, Dialog, snackbar, TextFieldOutlined } from 'm3-svelte';
	import { match } from '$app/paths';
	import { PUBLIC_ORIGIN } from '$env/static/public';
	import { getIsMobileContext } from '$lib/context';
	import FloatingControls from '../layout/FloatingControls.svelte';

	type Props = {
		onclick: () => unknown;
		onImport: (docId: string) => void | Promise<void>;
		disabled?: boolean;
	};

	let { onclick, onImport, disabled }: Props = $props();

	let importLoading = $state(false);
	let importMenuOpen = $state(false);
	let importText = $state('');

	const mobile = getIsMobileContext();

	const handleCancelImport = () => {
		importText = '';
		importMenuOpen = false;
	};

	const handleSubmitImport = async (e: Event) => {
		if (!importText) return;
		e.preventDefault();

		try {
			importLoading = true;

			const url = new URL(importText);
			const path = await match(url.pathname);

			if (path?.id !== '/(app)/list/[listId]') {
				snackbar('Invalid list URL', undefined, true);
				return;
			}

			await onImport(path.params.listId);
		} finally {
			importLoading = false;
		}
	};
</script>

<Dialog bind:open={importMenuOpen} headline="Import public list" onclose={handleCancelImport}>
	<form
		id="list-import-form"
		method="dialog"
		onsubmit={handleSubmitImport}
		onreset={handleCancelImport}
	>
		<p>
			You can import public lists by pasting their link here.<br /> (iOS doesn't open links in the app,
			so importing is necessary)
		</p>

		<TextFieldOutlined
			placeholder="{PUBLIC_ORIGIN}/list/automerge:example"
			type="url"
			label=""
			bind:value={importText}
			required
		/>
	</form>

	{#snippet buttons()}
		<Button form="list-import-form" variant="tonal" type="reset" disabled={importLoading}>
			Cancel
		</Button>
		<Button form="list-import-form" type="submit" iconType="left" disabled={importLoading}>
			<Import stroke-linecap="butt" />
			Import
		</Button>
	{/snippet}
</Dialog>

<FloatingControls viewTransitionName="controls">
	<Button
		iconType={mobile.current ? 'full' : 'left'}
		variant="elevated"
		size="s"
		onclick={() => (importMenuOpen = true)}
		{disabled}
		title="Import list"
		square={!mobile.current}
	>
		<Import />
		{#if !mobile.current}Import{/if}
	</Button>

	<Button
		size="m"
		iconType={mobile.current ? 'full' : 'left'}
		{onclick}
		{disabled}
		title="Create list"
		square={!mobile.current}
	>
		<Plus stroke-linecap="square" />
		{#if !mobile.current}Create{/if}
	</Button>
</FloatingControls>

<style>
	#list-import-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
	}
</style>
