import { getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { auth } from '../server/auth';

/**
 * Can be used server-side to retrieve the session and user for the current request
 */
export const authenticate = async () => {
	const e = getRequestEvent();

	const result = await auth.api.getSession({ headers: e.request.headers });

	return {
		session: result?.session ?? null,
		user: result?.user ?? null
	};
};

/**
 * Returns user if authenticated, throws a '401 unauthorized' error if unauthenticated.
 */
export const mustAuthenticate = async () => {
	const { user } = await authenticate();
	if (!user) error(401, 'unauthorized'); // TODO: redirect to sign-in?

	return user;
};
