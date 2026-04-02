<script lang="ts">
	import { Import, Plus } from '@lucide/svelte';
	import { Button, Dialog, snackbar, TextFieldOutlined } from 'm3-svelte';
	import DesktopOnly from '../layout/DesktopOnly.svelte';
	import MobileOnly from '../layout/MobileOnly.svelte';
	import { match } from '$app/paths';
	import { PUBLIC_ORIGIN } from '$env/static/public';

	type Props = {
		onclick: () => unknown;
		onImport: (docId: string) => void | Promise<void>;
		disabled?: boolean;
	};

	let { onclick, onImport, disabled }: Props = $props();

	let importLoading = $state(false);
	let importMenuOpen = $state(false);
	let importText = $state('');

	const handleCancelImport = () => {
		importText = '';
		importMenuOpen = false;
	};

	const handleImportSubmit = async (e: Event) => {
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
		onsubmit={handleImportSubmit}
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
			<Import />
			Import
		</Button>
	{/snippet}
</Dialog>

<DesktopOnly>
	<div style="display: flex; align-items: center; gap: 0.5rem; margin-left: auto;">
		<Button
			iconType="full"
			variant="elevated"
			size="s"
			onclick={() => (importMenuOpen = true)}
			{disabled}
		>
			<Import />
		</Button>

		<Button title="Create list" variant="filled" iconType="full" {onclick} {disabled}>
			<Plus />
		</Button>
	</div>
</DesktopOnly>

<MobileOnly>
	<div
		style="position: fixed; bottom: 1rem; right: 1rem; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;"
	>
		<Button
			iconType="full"
			variant="elevated"
			size="s"
			onclick={() => (importMenuOpen = true)}
			{disabled}
		>
			<Import />
		</Button>

		<Button size="m" iconType="full" {onclick} {disabled}>
			<Plus />
		</Button>
	</div>
</MobileOnly>

<style>
	#list-import-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
	}
</style>
