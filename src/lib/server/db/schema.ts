import { sql } from 'drizzle-orm';
import { index, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './auth.schema';

export const list = pgTable(
	'list',
	{
		id: text('id').primaryKey(),
		name: text('name').notNull(),
		ownerId: text('owner_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.default(sql`NULL`)
			.$onUpdateFn(() => new Date()),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [index('list_owner_id_index').on(table.ownerId)]
);

export type List = typeof list.$inferSelect;

export const listItem = pgTable(
	'list_item',
	{
		id: text('id').primaryKey(),
		listId: text('list_id')
			.notNull()
			.references(() => list.id, { onDelete: 'cascade' }),
		status: text('status', { enum: ['todo', 'done'] }).notNull(),
		text: text('text').notNull(),
		amount: integer('amount').notNull().default(1),
		// TODO: image attachments
		lastUpdatedByUserId: text('last_updated_by_user_id')
			.notNull()
			.references(() => user.id),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [index('list_item_list_id_index').on(table.listId)]
);

export type ListItem = typeof listItem.$inferSelect;

export * from './auth.schema';
