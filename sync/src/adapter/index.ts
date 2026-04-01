import { type Message, NetworkAdapter, type PeerId, type PeerMetadata, cbor as cborHelpers } from '@automerge/automerge-repo';
import { MapWithListener } from '../utils/map';
import type { SessionData } from '../types';
import { FromClientMessage, FromServerMessage, isJoinMessage } from '@automerge/automerge-repo-network-websocket/dist/messages';
import { ProtocolV1, type ProtocolVersion } from '@automerge/automerge-repo-network-websocket';
import { toArrayBuffer } from './arrayBuffer';

/**
 * Mostly the same as `WebsocketServerAdapter` from `@automerge/automerge-repo-network-websocket`,
 * but adapter for Cloudflare Durable Objects using hibernatable websockets.
 */
export class CustomWebSocketAdapter extends NetworkAdapter {
	#sockets: MapWithListener<WebSocket, SessionData>;

	constructor(sessions: MapWithListener<WebSocket, SessionData>) {
		super();
		this.#sockets = sessions;
	}

	isReady = () => true;
	whenReady = async () => {};

	connect(peerId: PeerId, peerMetadata?: PeerMetadata): void {
		this.peerId = peerId;
		this.peerMetadata = peerMetadata;

		this.#sockets.on('delete', (ws: WebSocket, session: SessionData) => {
			if (session.peerId) this.emit('peer-disconnected', { peerId: session.peerId });
		});

		// TODO: keepalive loop
	}

	/**
	 * Called by the durable object when a client websocket sends a message to the server
	 */
	receiveMessage(socket: WebSocket, raw: string | ArrayBuffer) {
		if (typeof raw === 'string') return;

		let message: FromClientMessage;

		try {
			message = cborHelpers.decode(Buffer.from(raw));
		} catch (err) {
			console.log('failed to decode');
			socket.close(1003); // invalid data type
			return;
		}

		const { type, senderId } = message;

		const documentId = 'documentId' in message ? '@' + message.documentId : '';
		const { byteLength } = raw;
		console.log(`[${senderId} -> ${this.peerId}${documentId}] ${type} | ${byteLength} bytes`);

		// pass other messages through
		if (!isJoinMessage(message)) {
			this.emit('message', message);
			return;
		}

		const { peerMetadata, supportedProtocolVersions } = message;
		const existingSocket = this.getSocketByPeerId(senderId);
		if (existingSocket) {
			if (existingSocket.readyState === WebSocket.OPEN) {
				this.#removeSocket(existingSocket);
			}
			this.emit('peer-disconnected', { peerId: senderId });
		}

		this.emit('peer-candidate', { peerId: senderId, peerMetadata });

		const val = this.#sockets.get(socket);
		if (!val) throw new Error('socket not registered for peerId ' + senderId);

		// update socket map with sender id
		this.#sockets.setUntracked(socket, { id: val.id, peerId: senderId });

		console.log('set session', { id: val.id, peerId: senderId });

		const selectedProtocolVersion = selectProtocol(supportedProtocolVersions);
		if (selectedProtocolVersion === null) {
			this.send({
				type: 'error',
				senderId: this.peerId!,
				message: 'unsupported protocol version',
				targetId: senderId,
			} satisfies FromServerMessage);

			socket.close(); // terminate connection
			this.#sockets.delete(socket);
		} else {
			this.send({
				type: 'peer',
				senderId: this.peerId!,
				peerMetadata: this.peerMetadata!,
				selectedProtocolVersion: ProtocolV1,
				targetId: senderId,
			} satisfies FromServerMessage);
		}
	}

	send(message: Message): void {
		assert('targetId' in message && message.targetId !== undefined);
		if ('data' in message && message.data?.byteLength === 0) throw new Error('Tried to send a zero-length message');

		const senderId = this.peerId;
		assert(senderId, 'No peerId set for the websocket server network adapter.');

		const socket = this.getSocketByPeerId(message.targetId);
		if (!socket) {
			console.error(`Tried to send to disconnected peer: ${message.targetId}`);
			return;
		}

		const encoded = cborHelpers.encode(message);
		const arrayBuf = toArrayBuffer(encoded);

		socket.send(arrayBuf);
	}

	disconnect(): void {
		for (const socket of this.#sockets.keys()) {
			this.#removeSocket(socket);
		}
	}

	private getSocketByPeerId(peerId: string): WebSocket | undefined {
		// TODO: speed up by mapping peer ids to sockets as well
		for (const [socket, session] of this.#sockets.entries()) {
			if (session.peerId === peerId) {
				return socket;
			}
		}
	}

	#removeSocket(socket: WebSocket) {
		const session = this.#sockets.get(socket);
		if (!session?.peerId) return;

		console.log('removing socket', session);
		this.emit('peer-disconnected', { peerId: session.peerId });
		this.#sockets.delete(socket);
	}
}

const selectProtocol = (versions?: ProtocolVersion[]) => {
	if (versions === undefined) return ProtocolV1;
	if (versions.includes(ProtocolV1)) return ProtocolV1;
	return null;
};

const assert = <T>(val: unknown, message = 'Assertation failed'): val is T => {
	if (val === false || val === undefined || val === null) {
		throw new Error(message);
	}

	return true;
};
