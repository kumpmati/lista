<script lang="ts">
	import { Plus } from '@lucide/svelte';
	import { Button } from 'm3-svelte';
</script>

<main>
	<div class="header">
		<h1>My lists</h1>
		<Button size="s" iconType="full">
			<Plus />
		</Button>
	</div>
</main>

<style>
	h1 {
		font-size: 20px;
		font-weight: bold;
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	main {
		display: flex;
		flex-direction: column;
		margin: 0 auto;
		max-width: 56rem;
	}
</style>
