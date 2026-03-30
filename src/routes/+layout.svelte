<script lang="ts">
	import '../normalize.css';
	import '../m3-theme.css';
	import '../layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Repo } from '@automerge/automerge-repo';
	import { IndexedDBStorageAdapter } from '@automerge/automerge-repo-storage-indexeddb';
	import { AutomergeRootEditor } from '$lib/editor/root/automerge.svelte';
	import { setIdbContext, setRootEditorContext } from '$lib/context';

	let { children } = $props();

	const idb = new IndexedDBStorageAdapter();
	setIdbContext(idb);

	const rootRepo = new Repo({
		storage: idb,
		shareConfig: { access: async () => false, announce: async () => false }
	});

	const rootEditor = new AutomergeRootEditor(rootRepo);
	setRootEditorContext(rootEditor);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
