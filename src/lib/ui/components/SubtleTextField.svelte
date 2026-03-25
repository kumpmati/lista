<script lang="ts">
	import { type HTMLInputAttributes } from 'svelte/elements';

	let { value = $bindable(), ...props }: Omit<HTMLInputAttributes, 'type'> = $props();
</script>

<input type="text" {...props} bind:value />

<style>
	input {
		margin-left: 4px;
		padding: 1rem;
		line-height: 1;
		border-radius: 4px;
		background-color: var(--m3c-surface-container);
		font-size: 1rem;
		font-family: var(--m3c-font);
		width: 100%;

		transition: background-color 100ms;

		&:hover {
			background-color: var(--m3c-surface-container-high);
		}
	}
</style>
