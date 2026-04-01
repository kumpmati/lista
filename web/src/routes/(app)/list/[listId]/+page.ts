import { PUBLIC_SYNC_SERVER_URL } from '$env/static/public';
import { AutomergeListEditor } from '$lib/editor/list/automerge.svelte';
import type { ListV2 } from '$lib/types';
import { isValidAutomergeUrl, Repo } from '@automerge/automerge-repo';
import { WebSocketClientAdapter } from '@automerge/automerge-repo-network-websocket';
import { document } from '@automerge/automerge-repo-svelte-store';
import { error } from '@sveltejs/kit';

export const load = async ({ params, parent }) => {
	const { idb, root } = await parent();

	const repo = new Repo({
		storage: idb, // use same IDB instance as root document
		network: [new WebSocketClientAdapter(PUBLIC_SYNC_SERVER_URL)],

		// don't broadcast new documents with other peers.
		shareConfig: {
			announce: async () => true, // don't announce new documents to other peers
			access: async () => true // any peer that knows the document ID can access documents
		}
	});

	if (!isValidAutomergeUrl(params.listId)) {
		error(400, 'invalid list id');
	}

	const doc = await document<ListV2>(params.listId, repo).catch(() => null);
	if (!doc) {
		error(404, 'list not found');
	}

	await root.syncMeta(doc.url, doc.handle.doc());

	const editor = new AutomergeListEditor(doc);

	const cleanup = () => {
		editor.cleanup();
		repo.shutdown();
	};

	return { doc, editor, cleanup };
};
