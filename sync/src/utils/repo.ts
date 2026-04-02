import { NetworkAdapter, Repo } from '@automerge/automerge-repo';
import { DurableObjectStorageAdapter } from '../adapter/storage';

export const createRepo = (adapter: NetworkAdapter, db: DurableObjectStorage) => {
	return new Repo({
		network: [adapter],
		storage: new DurableObjectStorageAdapter(db),
		/** @ts-ignore @type {(import("@automerge/automerge-repo").PeerId)}  */
		peerId: `sync-server-lista.matsku.dev`,
		// Since this is a server, we don't share generously — meaning we only sync documents they already
		// know about and can ask for by ID.
		sharePolicy: async () => false,
	});
};
