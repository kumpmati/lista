import type { DocHandle } from '@automerge/automerge-repo';
import type { RootItem, ListItemV2, ListV2 } from './types';

export interface RootEditor {
	readonly loading: boolean;
	readonly current: Readonly<{ items: RootItem[] }>;

	addList(title?: string): Promise<RootItem>;
	syncMeta(id: string, list: ListV2): Promise<void>;
	removeList(id: string): Promise<void>;
}

export interface ListEditor {
	raw: DocHandle<ListV2>;
	current: Readonly<ListV2>;

	addItem(item: Omit<ListItemV2, 'id'>): Promise<ListItemV2>;
	removeItem(itemId: string): Promise<void>;
	updateItem(itemId: string, data: Partial<Omit<ListItemV2, 'id'>>): Promise<ListItemV2>;
	setTitle(title: string): Promise<void>;
}
