import { browser } from '$app/environment';
import type { Attachment } from 'svelte/attachments';

export const useClickOutside = (callback: () => void): Attachment => {
	return (node) => {
		if (!browser) return;

		const handleClick = (e: Event) => {
			if (!node.contains(e.target as Node)) {
				callback();
			}
		};

		document.body.addEventListener('click', handleClick);

		return () => {
			document.body.removeEventListener('click', handleClick);
		};
	};
};
