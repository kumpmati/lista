import { eq } from 'drizzle-orm';
import { db } from '../db';
import { list } from '../db/schema';
import type { CreateListBody, ListStore } from './interface';
import { nanoid } from 'nanoid';

export class PostgresListStore implements ListStore {
	async deleteList(listId: string) {
		await db.delete(list).where(eq(list.id, listId));
	}

	async createList(l: CreateListBody) {
		const [inserted] = await db
			.insert(list)
			.values({ id: nanoid(10), name: l.name, ownerId: l.ownerId })
			.returning();

		if (!inserted) {
			throw new Error('failed to insert');
		}

		return inserted;
	}

	async getUserLists(userId: string) {
		// TODO: also get lists where user is a member
		return await db.select().from(list).where(eq(list.ownerId, userId));
	}

	async getListById(listId: string) {
		// TODO: verify membership/ownership
		const row = await db.query.list.findFirst({
			where: eq(list.id, listId),
			with: { items: true }
		});

		if (!row) {
			throw new Error('list not found');
		}

		return row;
	}
}
