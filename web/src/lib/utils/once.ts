/**
 * Returns a function that memoizes the first run of the function and returns it on subsequent calls.
 */
export const once = <T extends unknown[], R>(func: (...args: T) => R): ((...args: T) => R) => {
	let value: R | undefined;
	let wasCalled = false;

	const wrapped = (...args: T): R => {
		if (wasCalled) {
			return value!;
		}

		value = func(...args);
		wasCalled = true;

		return value;
	};

	return wrapped;
};
