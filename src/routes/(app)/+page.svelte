<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { getCurrentUser, signInGoogle } from '$lib/queries/auth.remote';
	import { createList, getOwnLists } from '$lib/queries/list.remote';
	import Header from '$lib/ui/layout/Header.svelte';
	import Main from '$lib/ui/layout/Main.svelte';
	import { Plus } from '@lucide/svelte';
	import { Button } from 'm3-svelte';

	const user = $derived(await getCurrentUser());
	const lists = $derived(user ? await getOwnLists() : null);

	const handleCreateList = async () => {
		const list = await createList({ name: 'Untitled list' });
		goto(resolve('/(app)/list/[listId]', { listId: list.id }));
	};
</script>

<svelte:head>
	<title>My lists | Lista</title>
</svelte:head>

<Main>
	<Header>
		<h1>My lists</h1>
		<Button
			square
			size="s"
			variant="text"
			iconType="full"
			onclick={handleCreateList}
			style="margin-right: .5rem; margin-left: auto;"
		>
			<Plus />
		</Button>
	</Header>

	{#if !user}
		<Button
			onclick={() =>
				signInGoogle().then((d) => {
					window.location.href = d.url;
				})}
		>
			Google Sign In
		</Button>
	{:else}
		<ul>
			{#each lists as list (list.id)}
				<li>
					<a class="list m3-layer" href={resolve('/(app)/list/[listId]', { listId: list.id })}>
						{list.name}
					</a>
				</li>
			{:else}
				<li>No lists yet.</li>
			{/each}
		</ul>
	{/if}
</Main>

<style>
	h1 {
		margin-left: 1.5rem;
		font-size: 20px;
		font-weight: bold;
		color: var(--m3c-primary);
	}

	.list {
		display: flex;
		align-items: center;
		padding-inline: 1.5rem;
		padding-block: 1rem;

		text-decoration: none;
		color: var(--white);
		font-weight: bold;
	}
</style>
