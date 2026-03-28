<script lang="ts">
	import { resolve } from '$app/paths';
	import type { ListV2 } from '$lib/types';
	import Header from '$lib/ui/layout/Header.svelte';
	import Main from '$lib/ui/layout/Main.svelte';
	import { getContextRepo } from '@automerge/automerge-repo-svelte-store';
	import { Plus } from '@lucide/svelte';
	import { Button } from 'm3-svelte';
	import { PersistedState } from 'runed';

	const repo = getContextRepo();
	const lists = new PersistedState('lists', [] as { id: string; title: string }[]);

	const handleCreateList = async () => {
		const doc = repo.create({
			meta: { title: 'Untitled list', version: 2 },
			items: [],
			groups: []
		} satisfies ListV2);

		doc.doneLoading = () => console.log('done loading');

		lists.current.push({
			id: doc.documentId.toString(),
			title: doc.doc().meta.title
		});

		// goto(resolve('/(app)/list/[listId]', { listId: doc.documentId.toString() }));
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

	<ul>
		{#each lists.current as list (list.id)}
			<li>
				<a class="list m3-layer" href={resolve('/(app)/list/[listId]', { listId: list.id })}>
					{list.title}
				</a>
			</li>
		{:else}
			<li>No lists yet.</li>
		{/each}
	</ul>
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
