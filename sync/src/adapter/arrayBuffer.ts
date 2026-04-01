/**
 * This incantation deals with websocket sending the whole underlying buffer even if we just have a
 * uint8array view on it
 */
export const toArrayBuffer = (bytes: Uint8Array): ArrayBuffer => {
	const { buffer, byteOffset, byteLength } = bytes;
	const slice = buffer.slice(byteOffset, byteOffset + byteLength);
	if (slice instanceof SharedArrayBuffer) {
		throw new Error('shared array buffer');
	}

	return slice;
};
