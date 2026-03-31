import type { RootItem, ListItemV2, ListV2 } from './types';

export interface RootEditor {
	readonly current: Readonly<{ items: RootItem[] }>;

	onReady(): Promise<void>;
	addList(title?: string): Promise<RootItem>;
	syncMeta(id: string, list: ListV2): Promise<void>;
	removeList(id: string): Promise<void>;

	cleanup(): void;
}

export interface ListEditor {
	current: Readonly<ListV2>;

	addItem(item: Omit<ListItemV2, 'id'>): Promise<ListItemV2>;
	removeItem(itemId: string): Promise<void>;
	updateItem(itemId: string, data: Partial<Omit<ListItemV2, 'id'>>): Promise<ListItemV2>;
	batchUpdate(mutate: (item: ListItemV2) => void): Promise<void>;
	setTitle(title: string): Promise<void>;

	cleanup(): void;
}
