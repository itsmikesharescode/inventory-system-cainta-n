<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { borrowItemSchema, type BorrowItemSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import Plus from 'lucide-svelte/icons/plus';
	import { timeMeta } from '$lib';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { toast } from 'svelte-sonner';
	import TeacherPicker from '$lib/components/general/teacher-picker.svelte';
	import ItemPicker from '$lib/components/general/item-picker.svelte';
	import ComboPicker from '$lib/components/general/combo-picker.svelte';
	import DatePicker from '$lib/components/general/date-picker.svelte';
	import { TimePicker } from '$lib/components/general/time-picker/index.js';
	import RoomPicker from '$lib/components/general/room-picker.svelte';
	interface Props {
		borrowItemForm: SuperValidated<Infer<BorrowItemSchema>>;
	}

	const { borrowItemForm }: Props = $props();

	let open = $state(false);

	const form = superForm(borrowItemForm, {
		validators: zodClient(borrowItemSchema),
		id: 'add-borrower-form',
		onUpdate: async ({ result }) => {
			const { status, data } = result;

			switch (status) {
				case 200:
					toast.success(data.msg);
					reset();
					open = false;
					break;
				case 401:
					toast.error(data.msg);
					break;
			}
		}
	});

	const { form: formData, enhance, submitting, reset } = form;

	$effect(() => {
		if (open) {
			return () => {
				reset();
			};
		}
	});
</script>

<Button onclick={() => (open = true)} class="items-center"><Plus /> Borrow Item</Button>
<Dialog.Root bind:open>
	<Dialog.Content class="max-h-screen max-w-[650px] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>Borrower Item</Dialog.Title>
		</Dialog.Header>

		<form method="POST" action="?/addBorrowerEvent" use:enhance>
			<section class="grid gap-4 md:grid-cols-2">
				<div class="">
					<Form.Field {form} name="item_id">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Item</Form.Label>
								<ItemPicker bind:item_id={$formData.item_id} />
								<input type="hidden" {...props} bind:value={$formData.item_id} />
							{/snippet}
						</Form.Control>
						<Form.Description />
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="quantity">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Quantity</Form.Label>
								<Input
									type="number"
									{...props}
									bind:value={$formData.quantity}
									placeholder="Enter quantity"
								/>
							{/snippet}
						</Form.Control>
						<Form.Description />
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="room_id">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Room</Form.Label>
								<RoomPicker bind:room_id={$formData.room_id} />
								<input type="hidden" {...props} bind:value={$formData.room_id} />
							{/snippet}
						</Form.Control>
						<Form.Description />
						<Form.FieldErrors />
					</Form.Field>
				</div>

				<div class="">
					<Form.Field {form} name="date">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Returned Date</Form.Label>
								<DatePicker bind:selected={$formData.date} />
								<input type="hidden" {...props} bind:value={$formData.date} />
							{/snippet}
						</Form.Control>
						<Form.Description />
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="time">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Returned Time</Form.Label>
								<TimePicker bind:value={$formData.time} />
								<input type="hidden" {...props} bind:value={$formData.time} />
							{/snippet}
						</Form.Control>
						<Form.Description />
						<Form.FieldErrors />
					</Form.Field>
				</div>
			</section>

			<section class="flex justify-end">
				<Form.Button disabled={$submitting} class="relative">
					{#if $submitting}
						<div class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary">
							<LoaderCircle class="h-[20px] w-[20px] animate-spin" />
						</div>
					{/if}
					Borrow
				</Form.Button>
			</section>
		</form>
	</Dialog.Content>
</Dialog.Root>
