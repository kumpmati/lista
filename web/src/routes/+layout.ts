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

	// we don't intend on sharing the root document, so no network adapter.
	const rootRepo = new Repo({ storage: idb });

	const root: RootEditor = new AutomergeRootEditor(rootRepo);
	await root.onReady();

	return { idb, root };
};
