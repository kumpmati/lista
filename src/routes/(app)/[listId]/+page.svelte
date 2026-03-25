<script lang="ts">
	import { getListById } from '$lib/queries/list.remote.js';
	import Header from '$lib/ui/layout/Header.svelte';
	import Main from '$lib/ui/layout/Main.svelte';
	import { ArrowLeft } from '@lucide/svelte';
	import { Button } from 'm3-svelte';

	let { params } = $props();

	const list = $derived(await getListById(params.listId));
</script>

<svelte:head>
	<title>{list.name}</title>
</svelte:head>

<Main>
	<Header>
		<Button iconType="full" href="/" variant="text">
			<ArrowLeft />
		</Button>

		<h1>{list.name}</h1>
	</Header>
</Main>

<style>
	h1 {
		margin-left: 0.5rem;
		font-size: 20px;
		font-weight: bold;
		color: var(--m3c-primary);
	}
</style>
