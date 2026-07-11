<script lang="ts">
	import { resolve } from '$app/paths';
	import Header from '$lib/ui/layout/Header.svelte';
	import Main from '$lib/ui/layout/Main.svelte';
	import { wrap } from '$lib/utils/wrap.svelte';
	import { ArrowLeft, Wifi } from '@lucide/svelte';
	import { Button, snackbar, TextFieldOutlined } from 'm3-svelte';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();

	// svelte-ignore state_referenced_locally
	let kauppaApiKeyDraft = $state(data.root.current.settings.kauppaApiKey ?? '');
	let kauppaApiKeyDirty = $derived(
		(data.root.current.settings.kauppaApiKey ?? '') !== kauppaApiKeyDraft
	);

	const saveKauppaApiChanges = wrap(async () => {
		await data.root.updateSettings({ kauppaApiKey: kauppaApiKeyDraft });
		await invalidateAll();
	});

	const storeApiHealth = wrap(async () => {
		if (!data.storeApi) return;

		try {
			await data.storeApi.health();
			snackbar('Check succeeded', {}, true);
		} catch (err) {
			const msg = err instanceof Error ? err.message : 'Unknown error';
			snackbar(`Check failed: ${msg}`, {}, true);
		}
	});
</script>

<svelte:head>
	<title>Settings</title>
</svelte:head>

<Main>
	<Header sticky>
		<Button iconType="full" href={resolve('/')} variant="text">
			<ArrowLeft stroke-linecap="square" />
		</Button>

		<h1>Settings</h1>
	</Header>

	<div class="content">
		<fieldset>
			<legend>Kauppa API</legend>
			<small>Allows loading product information from an external source</small>

			<TextFieldOutlined label="API Key" type="password" bind:value={kauppaApiKeyDraft} />
			<div class="row">
				<Button
					onclick={saveKauppaApiChanges.run}
					disabled={saveKauppaApiChanges.pending.size > 0 || !kauppaApiKeyDirty}
				>
					Save Changes
				</Button>
				{#if data.root.current.settings.kauppaApiKey}
					<Button
						variant="tonal"
						onclick={storeApiHealth.run}
						disabled={storeApiHealth.pending.size > 0 || saveKauppaApiChanges.pending.size > 0}
					>
						{#if storeApiHealth.pending.size > 0}
							Checking connection...
						{:else}
							<Wifi stroke-linecap="square" />
							Check connection
						{/if}
					</Button>
				{/if}
			</div>
		</fieldset>
	</div>
</Main>

<style>
	h1 {
		display: flex;
		align-items: center;
		gap: 0.3em;
		font-size: 20px;
		font-weight: bold;
		color: var(--m3c-primary);
		user-select: none;
		height: 2.5rem;
		margin-left: 0.5rem;
	}

	.content {
		padding: 1rem;
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	fieldset {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		border: 1px solid var(--m3c-outline-variant);
		padding: 1rem;
		border-radius: 0.5rem;

		legend {
			padding-inline: 0.25rem;
			color: var(--m3c-on-surface);
		}
	}

	small {
		color: var(--m3c-on-surface-variant);
	}
</style>
