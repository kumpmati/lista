import type { RootEditor } from '$lib/interface';
import type { RootItem, ListV2 } from '$lib/types';
import { sleep } from '$lib/utils/sleep';
import { ImmutableString, type AutomergeUrl, type Repo } from '@automerge/automerge-repo';
import { document, type AutomergeDocumentStore } from '@automerge/automerge-repo-svelte-store';
import { onDestroy } from 'svelte';
import { get } from 'svelte/store';

const ROOT_DOCUMENT_ID_KEY = 'lista-root-docId';

export class AutomergeRootEditor implements RootEditor {
	#repo: Repo;
	#handle: AutomergeDocumentStore<{ items: RootItem[] }> | null = null;
	#unsubscribers: (() => void)[] = [];
	loading = $state(false);
	current = $state<Readonly<{ items: RootItem[] }>>({ items: [] });

	constructor(repo: Repo) {
		this.#repo = repo;
		this.init();

		onDestroy(() => this.#unsubscribers.forEach((cb) => cb()));
	}

	private async getOrCreateRootDoc() {
		const rootDocumentId = localStorage.getItem(ROOT_DOCUMENT_ID_KEY);
		if (rootDocumentId) {
			return await document<{ items: RootItem[] }>(rootDocumentId as AutomergeUrl, this.#repo);
		}

		const doc = this.#repo.create<{ items: RootItem[] }>({ items: [] });
		localStorage.setItem(ROOT_DOCUMENT_ID_KEY, doc.documentId.toString());

		return await document<{ items: RootItem[] }>(doc.documentId, this.#repo);
	}

	public async init() {
		try {
			this.loading = true;

			this.#handle = await this.getOrCreateRootDoc();
			if (!this.#handle) {
				throw new Error('failed to get root document');
			}

			this.subscribe();
		} finally {
			this.loading = false;
		}
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
				createdAt: new Date()
			},
			items: [],
			groups: []
		} satisfies ListV2);

		const item: RootItem = {
			id: doc.documentId.toString(),
			title,
			items: 0,
			shared: false
		};

		await sleep(100); // wait a bit for document to be ready

		this.#handle.change((root) => {
			root.items.push(item);
		});

		return item;
	}

	/**
	 * Updates the root doc to match the list's current state.
	 * @param id list ID
	 * @param list data to use when syncing
	 */
	async syncMeta(id: string, list: ListV2): Promise<void> {
		if (!this.#handle) throw new Error('not initialized');

		this.#handle.change((root) => {
			const index = root.items.findIndex((item) => item.id === id);
			if (index === -1) return;

			root.items[index].title = list.meta.title.toString();
			root.items[index].items = list.items.length;
		});
	}

	/**
	 * Removes the list from both the root doc and storage.
	 * @param id ID of list to delete
	 */
	async removeList(id: string): Promise<void> {
		if (!this.#handle) throw new Error('not initialized');
		this.#repo.delete(id as AutomergeUrl);

		this.#handle.change((root) => {
			const index = root.items.findIndex((item) => item.id === id);
			if (index !== -1) root.items.splice(index, 1);
		});
	}
}
