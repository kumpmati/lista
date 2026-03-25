import z from 'zod';
import type { List, ListItem } from '../db/schema';

export interface ListStore {
	createList(l: CreateListBody): Promise<List>;
	deleteList(id: string): Promise<void>;
	getUserLists(userId: string): Promise<List[]>;
	getListById(listId: string): Promise<List & { items: ListItem[] }>;
}

export const createListBodySchema = z.object({
	name: z.string().min(1).max(50),
	ownerId: z.string().min(1)
});

export type CreateListBody = z.infer<typeof createListBodySchema>;
