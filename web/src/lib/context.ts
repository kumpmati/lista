import { createContext } from 'svelte';
import type { IsMobile } from './utils/mobile.svelte';

export const [getIsMobileContext, setIsMobileContext] = createContext<IsMobile>();
