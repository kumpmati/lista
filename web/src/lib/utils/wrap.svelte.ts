import { SvelteSet } from 'svelte/reactivity';

/**
 * Wraps an async function so that its loading state can be tracked.
 * @param func function to wrap
 * @param key function that maps a function call to a unique pending state
 * @returns
 */
export const wrap = <T extends unknown[], R>(
	func: (...args: T) => Promise<R>,
	key?: (...args: T) => string
) => {
	const pending = new SvelteSet();

	const keyFunc = key ?? (() => true);

	const run = async (...args: T) => {
		try {
			pending.add(keyFunc(...args));
			return await func(...args);
		} finally {
			pending.delete(keyFunc(...args));
		}
	};

	return {
		get pending() {
			return pending;
		},
		run
	};
};
