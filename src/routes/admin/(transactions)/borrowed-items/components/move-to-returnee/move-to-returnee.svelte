<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { moveToReturneeSchema, type MoveToReturneeSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { toast } from 'svelte-sonner';
	import { useTableState } from '../table/tableState.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';

	interface Props {
		moveToReturneeForm: SuperValidated<Infer<MoveToReturneeSchema>>;
	}

	const { moveToReturneeForm }: Props = $props();

	const tableState = useTableState();

	const form = superForm(moveToReturneeForm, {
		validators: zodClient(moveToReturneeSchema),
		id: 'move-to-returnee-form',
		onUpdate: async ({ result }) => {
			const { status, data } = result;

			switch (status) {
				case 200:
					toast.success(data.msg);
					tableState.setActiveRow(null);
					tableState.setShowMoveToReturnee(false);
					reset();
					break;
				case 401:
					toast.error(data.msg);
					break;
			}
		}
	});

	const { form: formData, enhance, submitting, reset } = form;

	$effect(() => {
		$formData.user_id = tableState.getActiveRow()?.user_id ?? '';
		$formData.item_name = tableState.getActiveRow()?.item ?? '';
		$formData.quantity = tableState.getActiveRow()?.quantity ?? 0;
		$formData.reference_id = tableState.getActiveRow()?.reference_id ?? '';
		$formData.room_name = tableState.getActiveRow()?.room ?? '';
	});
</script>

<Dialog.Root
	controlledOpen
	onOpenChange={(open) => {
		tableState.setShowMoveToReturnee(open);
	}}
	open={tableState.getShowMoveToReturnee()}
>
	<Dialog.Content class="max-h-screen max-w-[650px] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>Move to Returnee</Dialog.Title>
			<Dialog.Description>
				<span>
					{tableState.getActiveRow()?.fullname} borrowed {tableState.getActiveRow()?.item} with quantity
					of {tableState.getActiveRow()?.quantity} will be moved to returnee and put the quantity back
					to our records.
				</span>
			</Dialog.Description>
		</Dialog.Header>

		<form method="POST" action="?/moveToReturneeEvent" use:enhance>
			<input type="hidden" name="user_id" value={tableState.getActiveRow()?.user_id} />
			<input type="hidden" name="item_id" value={tableState.getActiveRow()?.item_id} />
			<input type="hidden" name="item_name" value={tableState.getActiveRow()?.item} />
			<input type="hidden" name="quantity" value={tableState.getActiveRow()?.quantity} />
			<input type="hidden" name="reference_id" value={tableState.getActiveRow()?.reference_id} />
			<input type="hidden" name="room_name" value={tableState.getActiveRow()?.room} />
			<Form.Field {form} name="remarks">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Remarks</Form.Label>
						<Textarea
							{...props}
							rows={3}
							bind:value={$formData.remarks}
							placeholder="Enter remarks"
						/>
					{/snippet}
				</Form.Control>
				<Form.Description />
				<Form.FieldErrors />
			</Form.Field>

			<section class="flex justify-end">
				<Form.Button disabled={$submitting} class="relative">
					{#if $submitting}
						<div class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary">
							<LoaderCircle class="h-[20px] w-[20px] animate-spin" />
						</div>
					{/if}
					Move to Returnee
				</Form.Button>
			</section>
		</form>
	</Dialog.Content>
</Dialog.Root>
