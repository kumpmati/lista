<script lang="ts">
	import { Button } from 'm3-svelte';
	import MobileOnly from '../layout/MobileOnly.svelte';
	import DesktopOnly from '../layout/DesktopOnly.svelte';
	import { ListPlus } from '@lucide/svelte';

	type Props = {
		onclick: () => unknown;
	};

	let { onclick }: Props = $props();
</script>

<DesktopOnly>
	<div style="display: flex; align-items: center; gap: 0.5rem; margin-left: auto;">
		<Button {onclick} variant="text" iconType="full" title="Add group">
			<ListPlus />
		</Button>
	</div>
</DesktopOnly>

<MobileOnly>
	<div
		style="position: fixed; bottom: 1rem; right: 1rem; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;"
	>
		<Button {onclick} iconType="full" title="Add group">
			<ListPlus />
		</Button>
	</div>
</MobileOnly>
