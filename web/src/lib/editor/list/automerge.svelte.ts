import { assert } from '$lib/assert';
import type { ListEditor } from '$lib/interface';
import type { ListV2, ListItemV2, ListGroupV2 } from '$lib/types';
import { ImmutableString } from '@automerge/automerge-repo';
import { type AutomergeDocumentStore } from '@automerge/automerge-repo-svelte-store';
import { nanoid } from 'nanoid';
import { get } from 'svelte/store';

export class AutomergeListEditor implements ListEditor {
	#handle: AutomergeDocumentStore<ListV2>;
	#unsubscribers: (() => void)[];

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

	private init() {
		const unsub = this.#handle.subscribe((val) => {
			if (val) this.current = val;
		});

		this.#unsubscribers.push(unsub);
	}

	/**
	 * Updates the title of a list.
	 * @param title new title
	 */
	async setTitle(title: string): Promise<void> {
		assert(this.#handle, 'no document loaded');

		this.#handle.change((doc) => {
			doc.meta.title = new ImmutableString(title);
		});
	}

	/**
	 * Inserts a new item to the end of the list.
	 */
	async addItem(item: Omit<ListItemV2, 'id'>): Promise<ListItemV2> {
		assert(this.#handle, 'no document loaded');

		const newItem: ListItemV2 = { ...item, id: nanoid(10) };

		this.#handle.change((doc) => {
			doc.items.push(newItem);
		});

		return newItem;
	}

	/**
	 * Removes an item from the list
	 */
	async removeItem(itemId: string): Promise<void> {
		assert(this.#handle, 'no document loaded');

		this.#handle.change((doc) => {
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
		this.#handle.change((doc) => {
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

	/**
	 * Updates all items in the list as a single patch using the given mutate function.
	 * @param mutate function that mutates the item
	 */
	async batchUpdateItems(mutate: (item: ListItemV2, remove: () => void) => void): Promise<void> {
		assert(this.#handle, 'no document loaded');

		this.#handle.change((doc) => {
			const trash: ListItemV2[] = [];

			// don't delete while iterating so items aren't skipped
			for (let i = 0; i < doc.items.length; i++) {
				const remove = () => trash.push(doc.items[i]);
				mutate(doc.items[i], remove);
			}

			trash.forEach((item) => {
				doc.items.splice(doc.items.indexOf(item), 1);
			});
		});
	}

	/**
	 * Adds a new group to the list
	 * @param text group title
	 */
	async addGroup(text: string): Promise<ListGroupV2> {
		assert(this.#handle, 'no document loaded');

		const group: ListGroupV2 = {
			id: nanoid(15),
			text: new ImmutableString(text)
		};

		this.#handle.change((doc) => {
			doc.groups.push(group);
		});

		return group;
	}

	/**
	 * Removes a group from the list.
	 * @param groupId group to delete
	 * @param deleteItems if true, deletes all items in the group. Otherwise makes the items ungrouped.
	 */
	async removeGroup(groupId: string, deleteItems?: boolean): Promise<void> {
		assert(this.#handle, 'no document loaded');

		this.#handle.change((doc) => {
			const index = doc.groups.findIndex((g) => g.id === groupId);
			if (index !== -1) doc.groups.splice(index, 1);
		});

		await this.batchUpdateItems((item, remove) => {
			if (item.groupId !== groupId) return; // ignore items not in this group

			if (deleteItems) {
				remove();
			} else {
				item.groupId = null;
			}
		});
	}

	async updateGroup(groupId: string, data: Partial<Omit<ListGroupV2, 'id'>>): Promise<ListGroupV2> {
		assert(this.#handle, 'no document loaded');

		let updated: ListGroupV2 | undefined;

		this.#handle.change((doc) => {
			const index = doc.groups.findIndex((g) => g.id === groupId);
			if (index === -1) return;

			Object.assign(doc.groups[index], data);
			updated = doc.groups[index];
		});

		if (!updated) {
			throw new Error('group not found');
		}

		return updated;
	}

	/**
	 * Makes the list public.
	 */
	async makePublic(): Promise<void> {
		assert(this.#handle, 'no document loaded');

		this.#handle.change((doc) => {
			doc.meta.public = true; // cannot be changed back to false
		});
	}

	cleanup(): void {
		this.#unsubscribers.forEach((cb) => cb());
	}
}
