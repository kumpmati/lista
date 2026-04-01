import EventEmitter from 'eventemitter3';

/**
 * ReactiveMap<K,V> implements a subset of Map<K,V> along with the ability to listen to changes to the map
 */
export class MapWithListener<K, V> extends EventEmitter<'add' | 'delete' | 'clear'> {
	#m: Map<K, V>;

	constructor(initial?: Map<K, V>) {
		super();
		this.#m = initial ?? new Map();
	}

	/**
	 * Sets the key-value pair in the map, and emits an 'add' event with the key as the first arg, and the value as the seconds
	 */
	set(key: K, value: V): this {
		this.#m.set(key, value);
		this.emit('add', key, value);
		return this;
	}

	/**
	 * Sets the key-value pair in the map without emitting an 'add' event.
	 */
	setUntracked(key: K, value: V): this {
		this.#m.set(key, value);
		return this;
	}

	/**
	 * Returns the value associated with the key, or undefined if no value is found
	 */
	get(key: K): V | undefined {
		return this.#m.get(key);
	}

	/**
	 * Removes the key from the map, and emits a 'delete' event with the deleted key as first arg, and the deleted value as the second.
	 */
	delete(key: K): boolean {
		const val = this.get(key);

		const didExist = this.#m.delete(key);
		if (didExist) this.emit('delete', key, val);

		return didExist;
	}

	clear(): void {
		this.#m.clear();
		this.emit('clear');
	}

	get size(): number {
		return this.#m.size;
	}

	values() {
		return this.#m.values();
	}

	keys() {
		return this.#m.keys();
	}

	entries() {
		return this.#m.entries();
	}
}
