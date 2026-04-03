<script lang="ts">
	import { ListPlus, Plus } from '@lucide/svelte';
	import { Button } from 'm3-svelte';

	type Props = {
		onCreateItem: () => void | Promise<void>;
		onCreateGroup: () => void | Promise<void>;
	};

	let { onCreateItem, onCreateGroup }: Props = $props();
</script>

<div class="wrapper">
	<p>This list is still empty. <br />Perhaps add an item or a group?</p>

	<div class="buttons">
		<Button iconType="left" onclick={onCreateItem} variant="elevated" size="xs">
			<Plus /> Item
		</Button>
		<Button iconType="left" onclick={onCreateGroup} variant="elevated" size="xs">
			<ListPlus /> Group
		</Button>
	</div>
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
		color: var(--m3c-on-surface-variant);
		line-height: 1.5;
		font-size: 14px;
	}

	.buttons {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
</style>
