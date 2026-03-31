export const assert = <T>(val: T | null | undefined, message = 'Assertation failed') => {
	if (val === false || val === null || val === undefined) {
		throw new Error(message);
	}

	return true;
};
