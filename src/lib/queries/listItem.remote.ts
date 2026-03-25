import { command, query } from '$app/server';
import { db } from '$lib/server/db';
import { listItem } from '$lib/server/db/schema';
import {
	createListItemBodySchema,
	getListItemsBodySchema,
	setListItemStatusBodySchema,
	updateListItemBodySchema
} from '$lib/server/services/interface';
import { nanoid } from 'nanoid';
import { mustAuthenticate } from './helpers';
import { eq } from 'drizzle-orm';
import z from 'zod';

export const getListItems = query(getListItemsBodySchema, async ({ listId }) => {
	await mustAuthenticate(); // TODO: check permissions

	const items = await db.select().from(listItem).where(eq(listItem.listId, listId));
	return items;
});

export const createListItem = command(createListItemBodySchema, async (body) => {
	await mustAuthenticate(); // TODO: check permissions

	const [inserted] = await db
		.insert(listItem)
		.values({
			id: nanoid(15),
			listId: body.listId,
			amount: body.amount,
			text: body.text,
			status: 'todo'
		})
		.returning();

	return inserted;
});

export const updateListItem = command(updateListItemBodySchema, async (body) => {
	await mustAuthenticate();

	// TODO: include timestamp in body, reject update if updated since body's timestamp
	const [updated] = await db
		.update(listItem)
		.set({ amount: body.amount, text: body.text })
		.where(eq(listItem.id, body.itemId))
		.returning();

	return updated;
});

export const updateListItemStatus = command(setListItemStatusBodySchema, async (body) => {
	await mustAuthenticate();

	// TODO: check permissions
	const [updated] = await db
		.update(listItem)
		.set({ status: body.status })
		.where(eq(listItem.id, body.itemId))
		.returning();

	return updated;
});

export const deleteListItem = command(z.string(), async (itemId) => {
	await mustAuthenticate(); // TODO: check permissions
	await db.delete(listItem).where(eq(listItem.id, itemId));
});
