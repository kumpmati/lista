import type { RootEditor } from '$lib/interface';
import type { RootItem, ListV2 } from '$lib/types';
import { sleep } from '$lib/utils/sleep';
import {
	ImmutableString,
	isValidAutomergeUrl,
	type AutomergeUrl,
	type Repo
} from '@automerge/automerge-repo';
import { document, type AutomergeDocumentStore } from '@automerge/automerge-repo-svelte-store';
import { get } from 'svelte/store';

const ROOT_DOCUMENT_ID_KEY = 'lista-root-docId';

const EMPTY_DESCRIPTION = '-';

type RootState = {
	items: RootItem[];
};

export class AutomergeRootEditor implements RootEditor {
	#repo: Repo;
	#handle: AutomergeDocumentStore<RootState> | null = null;
	#unsubscribers: (() => void)[] = [];
	#initPromise: Promise<void> | null = null;

	current = $state<Readonly<RootState>>({ items: [] });

	constructor(repo: Repo) {
		this.#repo = repo;
		this.#initPromise = this.init();
	}

	private async getOrCreateRootDoc() {
		const rootDocUrl = localStorage.getItem(ROOT_DOCUMENT_ID_KEY);
		if (rootDocUrl) {
			return await document<RootState>(rootDocUrl as AutomergeUrl, this.#repo);
		}

		const doc = this.#repo.create<RootState>({ items: [] });
		localStorage.setItem(ROOT_DOCUMENT_ID_KEY, doc.url.toString());

		return await document<RootState>(doc.url, this.#repo);
	}

	public async onReady(): Promise<void> {
		if (!this.#initPromise) {
			console.log('onready: running init');
			this.#initPromise = this.init();
		}

		await this.#initPromise;
	}

	private async init() {
		this.#handle = await this.getOrCreateRootDoc();
		if (!this.#handle) {
			throw new Error('failed to get root document');
		}

		this.subscribe();
	}

	private subscribe() {
		if (!this.#handle) throw new Error('not initialized');

		const initial = get(this.#handle)!;
		this.current = initial;

		const unsub = this.#handle!.subscribe((val) => {
			if (val) this.current = val;
		});

		this.#unsubscribers.push(unsub);
	}

	/**
	 * Creates a new empty list and adds it to the root doc.
	 */
	public async addList(title = 'Untitled list'): Promise<RootItem> {
		if (!this.#handle) throw new Error('not initialized');

		const doc = this.#repo.create({
			meta: {
				title: new ImmutableString(title),
				version: 2,
				// eslint-disable-next-line svelte/prefer-svelte-reactivity
				createdAt: new Date(),
				public: false
			},
			items: [],
			groups: []
		} satisfies ListV2);

		const item: RootItem = {
			id: doc.url.toString(),
			title,
			description: EMPTY_DESCRIPTION,
			public: false
		};

		await sleep(100); // wait a bit for document to be ready

		this.#handle.change((root) => {
			root.items.push(item);
		});

		return item;
	}

	/**
	 * Updates the root doc to match the list's current state, or adds a new item if not yet found.
	 * @param id list ID
	 * @param list data to use when syncing
	 * @param updated if true, update the root item's updatedAt field
	 */
	async syncMeta(id: string, list: ListV2): Promise<void> {
		if (!isValidAutomergeUrl(id)) throw new Error('not a valid automerge url');
		if (!this.#handle) throw new Error('not initialized');

		this.#handle.change((root) => {
			const index = root.items.findIndex((item) => item.id === id);
			if (index === -1) {
				root.items.push({
					id,
					title: list.meta.title.toString(),
					description: EMPTY_DESCRIPTION,
					public: list.meta.public,
					// eslint-disable-next-line svelte/prefer-svelte-reactivity
					updatedAt: new Date()
				});
			} else {
				const texts = list.items.map((i) => (i.amount > 1 ? `${i.text} (${i.amount}x)` : i.text));

				root.items[index].title = list.meta.title.toString();
				root.items[index].description = texts.join(', ') || EMPTY_DESCRIPTION;
				root.items[index].public = list.meta.public;

				// eslint-disable-next-line svelte/prefer-svelte-reactivity
				root.items[index].updatedAt = new Date();
			}
		});
	}

	/**
	 * Removes the list from both the root doc and storage.
	 * @param id ID of list to delete
	 */
	async removeList(id: string): Promise<void> {
		if (!isValidAutomergeUrl(id)) throw new Error('not a valid automerge url');
		if (!this.#handle) throw new Error('not initialized');
		this.#repo.delete(id as AutomergeUrl);

		this.#handle.change((root) => {
			const index = root.items.findIndex((item) => item.id === id);
			if (index !== -1) root.items.splice(index, 1);
		});
	}

	/**
	 * Sets a list's pinned status
	 */
	async setPinned(id: string, pinned: boolean): Promise<void> {
		if (!isValidAutomergeUrl(id)) throw new Error('not a valid automerge url');
		if (!this.#handle) throw new Error('not initialized');

		this.#handle.change((root) => {
			const index = root.items.findIndex((item) => item.id === id);
			if (index !== -1) root.items[index].pinned = pinned;
		});
	}

	cleanup(): void {
		this.#unsubscribers.forEach((cb) => cb());
	}
}
