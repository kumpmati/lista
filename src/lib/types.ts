export type ListV2 = {
	meta: {
		title: string; // TODO: ImmutableString
		version: 2;
	};
	groups: ListGroupV2[];
	items: ListItemV2[];
};

export type ListGroupV2 = {
	id: string;
	text: string; // TODO: ImmutableString
};

export type ListItemV2 = {
	id: string;
	groupId: string | null;
	done: boolean;
	text: string; // TODO: ImmutableString
	amount: number;
};
