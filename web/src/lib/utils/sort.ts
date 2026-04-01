import type { ListItemV2 } from '$lib/types';

export const sortItemsByStatus = (a: ListItemV2, b: ListItemV2) => {
	// converts status to int and sorts done last
	return +a.done - +b.done;
};

export const sortByLastUpdated = (a: { updatedAt?: Date }, b: { updatedAt?: Date }): number => {
	const now = new Date();

	const aDate = a.updatedAt ?? now;
	const bDate = b.updatedAt ?? now;

	return bDate.getTime() - aDate.getTime();
};

export const sortByPinned = (a: { pinned?: boolean }, b: { pinned?: boolean }): number => {
	// convert pinned to int and sort by pinned first
	return +(b.pinned ?? 0) - +(a.pinned ?? 0);
};
