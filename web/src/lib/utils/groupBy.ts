/**
 * Divides an array into groups of items using the given key function.
 * @param arr array to group
 * @param keyFunc function that returns a key based on the array item
 * @returns grouped items
 */
export const groupBy = <T, K extends string>(arr: T[], keyFunc: (val: T) => K): Record<K, T[]> => {
	const groups: Record<string, T[]> = {};

	for (const item of arr) {
		const key = keyFunc(item);

		groups[key] ??= [];
		groups[key].push(item);
	}

	return groups;
};
