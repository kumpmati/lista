import { command, query } from '$app/server';
import { auth } from '$lib/server/auth';
import { error } from '@sveltejs/kit';
import z from 'zod';
import { authenticate } from './helpers';

export const getCurrentUser = query(async () => {
	const { user } = await authenticate();
	return user;
});

export const signInGoogle = command(z.string().optional(), async (callbackURL) => {
	const result = await auth.api.signInSocial({
		body: { provider: 'google', callbackURL }
	});

	if (result.url) {
		return { url: result.url };
	}

	error(400, 'Google sign-in failed');
});

export const signOut = command(async () => {
	await auth.api.signOut();
});
