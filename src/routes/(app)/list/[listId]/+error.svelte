<script lang="ts">
	import { page } from '$app/state';
	import { ArrowLeft } from '@lucide/svelte';
	import { Button } from 'm3-svelte';
</script>

<main>
	<h1>
		<span>{page.status}</span>
		<small>{page.error?.message ?? 'unknown error'}</small>
	</h1>

	<Button href="/" variant="elevated" size="xs" iconType="left">
		<ArrowLeft size={16} />
		Back Home
	</Button>
</main>

<style>
	main {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3rem;
	}

	h1 {
		user-select: none;
		display: inline-flex;
		flex-direction: column;
		align-items: center;

		span {
			color: var(--m3c-on-surface);
			font-weight: bold;
			font-size: 3rem;
			line-height: 1;
		}

		small {
			color: var(--m3c-primary);
			font-size: 1rem;
		}
	}
</style>
