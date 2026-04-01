import { NetworkAdapter, Repo, RepoConfig } from '@automerge/automerge-repo';

const hostname = 'TODO';

export const createRepo = (adapter: NetworkAdapter) => {
	return new Repo({
		network: [adapter],
		/** @ts-ignore @type {(import("@automerge/automerge-repo").PeerId)}  */
		peerId: `sync-server-${hostname}`,
		// Since this is a server, we don't share generously — meaning we only sync documents they already
		// know about and can ask for by ID.
		sharePolicy: async () => false,
	});
};
