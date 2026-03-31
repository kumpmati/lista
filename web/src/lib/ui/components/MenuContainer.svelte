<script lang="ts">
	import { useClickOutside } from '$lib/utils/clickOutside';
	import type { Snippet } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	type Props = {
		open?: boolean;
		trigger: Snippet;
		children: Snippet;
	};

	let { open = $bindable(), trigger, children }: Props = $props();
</script>

<div style="position: relative; margin-left: auto;" {@attach useClickOutside(() => (open = false))}>
	{@render trigger()}

	{#if open}
		<div
			in:fly={{ duration: 150, y: -10, x: 5 }}
			out:fade={{ duration: 150 }}
			style="position: absolute; bottom: 0; right: 0; transform: translateY(100%); z-index: 100;"
		>
			{@render children()}
		</div>
	{/if}
</div>
