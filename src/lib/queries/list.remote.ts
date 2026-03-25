import { command, query } from '$app/server';
import { mustAuthenticate } from './helpers';
import z from 'zod';
import { error } from '@sveltejs/kit';
import { PostgresListStore } from '../server/services/list';
import { createListBodySchema } from '../server/services/interface';

const ls = new PostgresListStore();

export const createList = command(createListBodySchema.pick({ name: true }), async (body) => {
	const user = await mustAuthenticate();
	return ls.createList({ name: body.name, ownerId: user.id });
});

export const getOwnLists = query(async () => {
	const user = await mustAuthenticate();

	return ls.getUserLists(user.id);
});

export const getListById = query(z.string(), async (id) => {
	await mustAuthenticate();

	const row = await ls.getListById(id);
	if (!row) error(404, 'list not found');

	return row;
});

export const deleteList = command(z.string(), async (listId) => {
	const user = await mustAuthenticate();

	const list = await ls.getListById(listId);
	if (!list) error(404, 'list not found');
	if (list.ownerId !== user.id) error(403, 'forbidden');

	await ls.deleteList(list.id);
});
