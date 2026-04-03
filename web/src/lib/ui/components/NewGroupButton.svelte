<script lang="ts">
	import { Button } from 'm3-svelte';

	import { ListPlus } from '@lucide/svelte';

	type Props = {
		onclick: () => unknown;
	};

	let { onclick }: Props = $props();
</script>

<div>
	<Button {onclick} iconType="full" variant="tonal" title="Add group" size="m">
		<ListPlus stroke-linecap="square" />
	</Button>
</div>

<style>
	div {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		z-index: 2;
	}
</style>
