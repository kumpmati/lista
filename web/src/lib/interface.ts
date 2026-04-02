import type { RootItem, ListItemV2, ListV2, ListGroupV2 } from './types';

export interface RootEditor {
	readonly current: Readonly<{ items: RootItem[] }>;

	onReady(): Promise<void>;
	addList(title?: string): Promise<RootItem>;
	syncMeta(id: string, list: ListV2): Promise<void>;
	removeList(id: string): Promise<void>;
	setPinned(id: string, pinned: boolean): Promise<void>;

	cleanup(): void;
}

export interface ListEditor {
	current: Readonly<ListV2>;

	// items
	addItem(item: Omit<ListItemV2, 'id'>): Promise<ListItemV2>;
	removeItem(itemId: string): Promise<void>;
	updateItem(itemId: string, data: Partial<Omit<ListItemV2, 'id'>>): Promise<ListItemV2>;
	batchUpdateItems(mutate: (item: ListItemV2) => void): Promise<void>;

	// groups
	addGroup(text: string): Promise<ListGroupV2>;
	removeGroup(id: string, deleteItems?: boolean): Promise<void>;
	updateGroup(groupId: string, data: Partial<Omit<ListGroupV2, 'id'>>): Promise<ListGroupV2>;

	// meta
	setTitle(title: string): Promise<void>;
	makePublic(): Promise<void>;

	cleanup(): void;
}
