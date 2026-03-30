import type { ListV2 } from '$lib/types';
import z from 'zod';

export interface ListStore {
	createList(l: CreateListBody): Promise<ListV2>;
	deleteList(id: string): Promise<void>;
	getUserLists(userId: string): Promise<ListV2[]>;
	getListById(listId: string): Promise<ListV2>;
}

export const createListBodySchema = z.object({
	name: z.string().min(1).max(50),
	ownerId: z.string().min(1)
});

export type CreateListBody = z.infer<typeof createListBodySchema>;

export const getListItemsBodySchema = z.object({
	listId: z.string().min(1).max(20)
});

export const createListItemBodySchema = z.object({
	listId: z.string().min(1).max(20),
	amount: z.int().min(0).max(100_000),
	text: z.string().min(1).max(200)
});

export type CreateListItemBody = z.infer<typeof createListItemBodySchema>;

export const updateListItemBodySchema = z.object({
	itemId: z.string().min(1).max(20),
	amount: z.int().min(0).max(100_000),
	text: z.string().min(1).max(200)
});

export type UpdateListItemBody = z.infer<typeof updateListItemBodySchema>;

export const setListItemStatusBodySchema = z.object({
	itemId: z.string().min(1).max(20),
	status: z.union([z.literal('todo'), z.literal('done')])
});

export type SetListItemBody = z.infer<typeof setListItemStatusBodySchema>;
