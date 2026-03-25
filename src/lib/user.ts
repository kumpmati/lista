import type { User } from 'better-auth';
import { createContext } from 'svelte';

export const [getAuthContext, setAuthContext] = createContext<{ user: User | null }>();
