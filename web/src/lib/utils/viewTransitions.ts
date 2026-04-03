import { onNavigate } from '$app/navigation';

export const useViewTransitions = () => {
	return onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
};
