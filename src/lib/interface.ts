import type { ListItemV2, ListV2 } from './types';

export interface ListEditor {
	current: Readonly<ListV2>;

	addItem(item: Omit<ListItemV2, 'id'>): Promise<ListItemV2>;
	removeItem(itemId: string): Promise<void>;
	updateItem(itemId: string, data: Partial<Omit<ListItemV2, 'id'>>): Promise<ListItemV2>;
}
