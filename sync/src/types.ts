import { PeerId } from '@automerge/automerge-repo';

export type SessionData = {
	/**
	 * id used to restore a websocket session when returning from hibernation
	 */
	id: string;

	/**
	 * the automerge peer id associated with the websocket.
	 */
	peerId?: PeerId;
};
