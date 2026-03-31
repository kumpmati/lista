import { assert } from '$lib/assert';
import type { ListEditor } from '$lib/interface';
import type { ListV2, ListItemV2 } from '$lib/types';
import { ImmutableString } from '@automerge/automerge-repo';
import { type AutomergeDocumentStore } from '@automerge/automerge-repo-svelte-store';
import { nanoid } from 'nanoid';
// import { onDestroy } from 'svelte';
import { get } from 'svelte/store';

export class AutomergeListEditor implements ListEditor {
	#handle: AutomergeDocumentStore<ListV2>;
	#unsubscribers: (() => void)[]; // TODO: call unsubscribers when unmounting

	current: Readonly<ListV2>;

	constructor(doc: AutomergeDocumentStore<ListV2>) {
		assert(doc, 'list not found');

		const initial = get(doc);
		assert(initial, 'list is null');

		this.current = $state(initial!);
		this.#handle = doc;
		this.#unsubscribers = [];

		this.init();
	}

	private async init() {
		const unsub = this.#handle!.subscribe((val) => {
			if (val) this.current = val;
		});

		this.#unsubscribers.push(unsub);
	}

	async setTitle(title: string): Promise<void> {
		assert(this.#handle, 'no document loaded');

		this.#handle!.change((doc) => {
			doc.meta.title = new ImmutableString(title);
		});
	}

	/**
	 * Inserts a new item to the end of the list.
	 */
	async addItem(item: Omit<ListItemV2, 'id'>): Promise<ListItemV2> {
		assert(this.#handle, 'no document loaded');

		const newItem: ListItemV2 = { ...item, id: nanoid(10) };

		this.#handle!.change((doc) => {
			doc.items.push(newItem);
		});

		return newItem;
	}

	/**
	 * Removes an item from the list
	 */
	async removeItem(itemId: string): Promise<void> {
		assert(this.#handle, 'no document loaded');

		this.#handle!.change((doc) => {
			const index = doc.items.findIndex((item) => item.id === itemId);
			if (index === -1) return;

			doc.items.splice(index, 1);
		});
	}

	/**
	 * Updates the item. Only the given fields are updated.
	 */
	async updateItem(itemId: string, data: Partial<Omit<ListItemV2, 'id'>>): Promise<ListItemV2> {
		assert(this.#handle, 'no document loaded');

		let updated: ListItemV2 | undefined;

		// TODO: zod validation
		this.#handle!.change((doc) => {
			const index = doc.items.findIndex((item) => item.id === itemId);
			if (index === -1) return;

			Object.assign(doc.items[index], data); // merge
			updated = doc.items[index];
		});

		if (!updated) {
			throw new Error('item not found');
		}

		return updated;
	}

	cleanup(): void {
		this.#unsubscribers.forEach((cb) => cb());
	}
}
