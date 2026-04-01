<script lang="ts">
	import { Plus } from '@lucide/svelte';
	import { Button } from 'm3-svelte';

	type Props = {
		onclick: () => unknown;
		disabled?: boolean;
	};

	let { onclick, disabled }: Props = $props();
</script>

<div class="desktop">
	<Button
		title="Create list"
		variant="filled"
		iconType="full"
		{onclick}
		{disabled}
		style="margin-left: auto;"
	>
		<Plus />
	</Button>
</div>

<div class="mobile">
	<Button
		square
		size="m"
		style="position: fixed; bottom: 1rem; right: 1rem; z-index: 10;"
		iconType="full"
		{onclick}
		{disabled}
	>
		<Plus />
	</Button>
</div>

<style>
	@media screen and (width < 40rem) {
		.desktop {
			display: none;
		}

		.mobile {
			display: contents;
		}
	}

	@media screen and (width >= 40rem) {
		.mobile {
			display: none;
		}

		.desktop {
			display: contents;
		}
	}
</style>
