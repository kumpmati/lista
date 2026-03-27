<script lang="ts">
	import { resolve } from '$app/paths';
	import { InMemoryListEditor } from '$lib/editor/memory.svelte.js';
	import type { ListV2 } from '$lib/types.js';
	import ListEditor from '$lib/ui/ListEditor.svelte';
	import Header from '$lib/ui/layout/Header.svelte';
	import Main from '$lib/ui/layout/Main.svelte';
	import { ArrowLeft } from '@lucide/svelte';
	import { Button } from 'm3-svelte';

	const list = $derived({
		meta: { title: 'test list', version: 2 },
		items: [],
		groups: []
	} satisfies ListV2);

	const editor = $derived(new InMemoryListEditor(list));
</script>

<svelte:head>
	<title>{editor.current.meta.title}</title>
</svelte:head>

<Main>
	<Header>
		<Button iconType="full" href={resolve('/')} variant="text">
			<ArrowLeft />
		</Button>

		<h1>{editor.current.meta.title}</h1>
	</Header>

	<ListEditor {editor} />
</Main>

<style>
	h1 {
		margin-left: 0.5rem;
		font-size: 20px;
		font-weight: bold;
		color: var(--m3c-primary);
	}
</style>
