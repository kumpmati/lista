<script lang="ts">
	import { Plus } from '@lucide/svelte';
	import { Button } from 'm3-svelte';

	type Props = {
		onCreate: () => void | Promise<void>;
	};

	let { onCreate }: Props = $props();
</script>

<div class="wrapper">
	<p>You haven't created any lists yet.</p>

	<Button iconType="left" onclick={onCreate} variant="elevated" size="s">
		<Plus /> Create list
	</Button>
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 1.5rem;
		width: 100%;

		padding: 5rem 2rem;
	}

	p {
		font-size: 14px;
		color: var(--m3c-on-surface-variant);
	}
</style>
