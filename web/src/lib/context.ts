import { createContext } from 'svelte';
import type { RootEditor } from './interface';
import { IndexedDBStorageAdapter } from '@automerge/automerge-repo-storage-indexeddb';

export const [getRootEditorContext, setRootEditorContext] = createContext<RootEditor>();

export const [getIdbContext, setIdbContext] = createContext<IndexedDBStorageAdapter>();
