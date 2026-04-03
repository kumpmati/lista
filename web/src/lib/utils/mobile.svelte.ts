import { browser } from '$app/environment';
import { onDestroy } from 'svelte';

export class IsMobile {
	#innerWidth = $state(0);
	current = $derived(this.#innerWidth < 40 * 16 /* 40rem */);

	constructor() {
		if (!browser || typeof window === 'undefined') return;

		const handleResize = () => {
			this.#innerWidth = window.innerWidth;
		};

		handleResize();
		window.addEventListener('resize', handleResize);

		onDestroy(() => {
			window.removeEventListener('resize', handleResize);
		});
	}
}
