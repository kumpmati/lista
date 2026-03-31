import type { ImmutableString } from '@automerge/automerge-repo';

export type RootItem = {
	id: string;
	title: string;
	description: string;
	public: boolean;
};

export type ListV2 = {
	meta: {
		title: ImmutableString;
		version: 2;
		createdAt: Date;
		public: boolean;
	};
	groups: ListGroupV2[];
	items: ListItemV2[];
};

export type ListGroupV2 = {
	id: string;
	text: ImmutableString;
};

export type ListItemV2 = {
	id: string;
	groupId: string | null;
	done: boolean;
	text: ImmutableString;
	amount: number;
};
