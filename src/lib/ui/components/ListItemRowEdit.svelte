<script lang="ts">
	import { fade } from 'svelte/transition';
	import AmountPicker from './AmountPicker.svelte';
	import SubtleTextField from './SubtleTextField.svelte';
	import { Button } from 'm3-svelte';
	import { Save } from '@lucide/svelte';

	type Props = {
		text: string;
		amount: number;
		onSave: (amount: number, text: string) => void;
		onCancel: () => void;
		onDelete: () => void;
	};

	let { text = $bindable(), amount = $bindable(), onSave, onCancel, onDelete }: Props = $props();

	let currentAmount = $state(amount);
	let currentText = $state(text);

	const handleClose = async (type: 'cancel' | 'save', e?: Event) => {
		e?.preventDefault();
		if (type == 'save') onSave(currentAmount, currentText);
		else onCancel();
	};
</script>

<div
	role="none"
	class="backdrop"
	in:fade={{ duration: 100 }}
	onclick={() => handleClose('cancel')}
></div>

<div class="wrapper">
	<div class="item">
		<AmountPicker
			bind:amount={currentAmount}
			zeroAsDelete
			onDelete={() => confirm(`Delete ${text}?`) && onDelete()}
		/>

		<form onsubmit={(e) => handleClose('save', e)}>
			<SubtleTextField
				bind:value={currentText}
				placeholder="Item text here"
				style="margin-left: 4px"
				required
			/>
		</form>
	</div>

	<div class="buttons">
		<Button
			iconType="left"
			variant="tonal"
			size="xs"
			style="margin-left: auto;"
			onclick={() => handleClose('save')}
		>
			<Save />
			Save
		</Button>
	</div>
</div>

<style>
	.backdrop {
		background-color: black;
		opacity: 0.9;
		position: fixed;
		z-index: 100;
		inset: 0;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		position: relative;
		z-index: 101;
		gap: 1rem;
	}

	.buttons {
		position: absolute;
		bottom: 0;
		right: 1rem;
		transform: translateY(100%);
		display: flex;
	}

	.item {
		width: 100%;
		display: flex;
		align-items: center;
		line-height: 1;
		padding: 10px 1.5rem;
		padding-left: 0.5rem;
	}

	form {
		display: contents;
	}
</style>
