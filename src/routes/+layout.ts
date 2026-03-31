import { AutomergeRootEditor } from '$lib/editor/root/automerge.svelte';
import type { RootEditor } from '$lib/interface';
import { Repo } from '@automerge/automerge-repo';
import { IndexedDBStorageAdapter } from '@automerge/automerge-repo-storage-indexeddb';

/**
 * No need for server-side rendering, and not all automerge packages work on the server.
 */
export const ssr = false;

export const load = async () => {
	const idb = new IndexedDBStorageAdapter();

	const rootRepo = new Repo({
		storage: idb,
		shareConfig: { access: async () => false, announce: async () => false }
	});

	const root: RootEditor = new AutomergeRootEditor(rootRepo);
	await root.onReady();

	return { idb, root };
};
