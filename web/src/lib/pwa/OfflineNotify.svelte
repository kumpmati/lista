<script lang="ts">
	import { snackbar } from 'm3-svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		const handleOffline = () => {
			snackbar("You're offline (changes are still saved)", undefined, true);
		};

		const handleOnline = () => {
			snackbar("You're back online!", undefined, true);
		};

		window.addEventListener('offline', handleOffline);
		window.addEventListener('online', handleOnline);

		return () => {
			window.removeEventListener('offline', handleOffline);
			window.removeEventListener('online', handleOnline);
		};
	});
</script>
