import type { ListEditor } from '$lib/interface';
import type { ListItemV2, ListV2 } from '$lib/types';
import { nanoid } from 'nanoid';

export class InMemoryListEditor implements ListEditor {
	#list: ListV2;

	constructor(initial: ListV2) {
		this.#list = $state(initial);
	}

	get current() {
		return this.#list as Readonly<ListV2>;
	}

	async addItem(item: Omit<ListItemV2, 'id'>): Promise<ListItemV2> {
		const newItem: ListItemV2 = { ...item, id: nanoid(15) };
		this.#list.items.push(newItem);

		return newItem;
	}

	async removeItem(itemId: string): Promise<void> {
		const index = this.#list.items.findIndex((i) => i.id === itemId);
		if (index === -1) {
			return;
		}
		this.#list.items.splice(index, 1);
	}

	async updateItem(itemId: string, data: Partial<Omit<ListItemV2, 'id'>>): Promise<ListItemV2> {
		const index = this.#list.items.findIndex((i) => i.id === itemId);
		if (index === -1) {
			throw new Error('item not found');
		}

		Object.assign(this.#list.items[index], data); // merge new data into existing item

		return this.#list.items[index];
	}
}
