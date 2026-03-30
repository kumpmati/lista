<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { getRootEditorContext } from '$lib/context';
	import Header from '$lib/ui/layout/Header.svelte';
	import Main from '$lib/ui/layout/Main.svelte';
	import { Plus } from '@lucide/svelte';
	import { Button } from 'm3-svelte';

	const root = getRootEditorContext();

	const handleCreateList = async () => {
		const item = await root.addList();
		goto(resolve('/(app)/list/[listId]', { listId: item.id }));
	};
</script>

<svelte:head>
	<title>Lista</title>
</svelte:head>

<Main>
	<Header>
		<h1>Lista</h1>
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

	{#if root.loading}
		<p>Loading...</p>
	{:else}
		<ul class="list">
			{#each root.current.items as item (item.id)}
				<li>
					<a class="list-item m3-layer" href={resolve('/(app)/list/[listId]', { listId: item.id })}>
						<span class="title">{item.title}</span>
						<span class="items">{item.items || 0} items</span>
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
		margin-left: 0.5rem;
		font-size: 20px;
		font-weight: bold;
		color: var(--m3c-primary);
	}

	.list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
		gap: 1rem;
		padding: 1rem;
	}

	li {
		display: contents;
	}

	.list-item {
		background-color: var(--m3c-surface-container);
		border-radius: 0.75rem;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		text-decoration: none;

		.title {
			font-size: 16px;
			font-weight: bold;
			color: var(--white);

			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
		}

		.items {
			margin-top: 0.25rem;
			font-size: 14px;
		}
	}
</style>
