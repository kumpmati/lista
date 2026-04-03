<script lang="ts">
	import { Button } from 'm3-svelte';
	import { ListPlus } from '@lucide/svelte';
	import { getIsMobileContext } from '$lib/context';
	import FloatingControls from '../layout/FloatingControls.svelte';

	type Props = {
		onclick: () => unknown;
	};

	let { onclick }: Props = $props();

	const mobile = getIsMobileContext();
</script>

<FloatingControls viewTransitionName="controls">
	<Button
		{onclick}
		iconType={mobile.current ? 'full' : 'left'}
		variant="tonal"
		title="Add group"
		size="m"
		square={!mobile.current}
	>
		<ListPlus stroke-linecap="square" />
		{#if !mobile.current}Group{/if}
	</Button>
</FloatingControls>
