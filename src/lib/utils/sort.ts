import type { ListItemV2 } from '$lib/types';

export const sortItemsByStatus = (a: ListItemV2, b: ListItemV2) => {
	// converts status to int and sorts done last
	return +a.done - +b.done;
};
