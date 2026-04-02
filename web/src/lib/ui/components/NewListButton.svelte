<script lang="ts">
	import { Plus } from '@lucide/svelte';
	import { Button } from 'm3-svelte';
	import DesktopOnly from '../layout/DesktopOnly.svelte';
	import MobileOnly from '../layout/MobileOnly.svelte';

	type Props = {
		onclick: () => unknown;
		disabled?: boolean;
	};

	let { onclick, disabled }: Props = $props();
</script>

<DesktopOnly>
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
</DesktopOnly>

<MobileOnly>
	<Button
		size="m"
		style="position: fixed; bottom: 1rem; right: 1rem; z-index: 10;"
		iconType="full"
		{onclick}
		{disabled}
	>
		<Plus />
	</Button>
</MobileOnly>
