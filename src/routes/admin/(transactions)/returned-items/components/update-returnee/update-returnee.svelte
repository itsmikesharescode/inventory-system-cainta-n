<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { updateReturneeSchema, type UpdateReturneeSchema } from './schema';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import * as Form from '$lib/components/ui/form/index.js';
  import Plus from 'lucide-svelte/icons/plus';
  import { timeMeta } from '$lib';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { toast } from 'svelte-sonner';
  import ComboPicker from '$lib/components/general/combo-picker.svelte';
  import DatePicker from '$lib/components/general/date-picker.svelte';
  import BorrowedItemPicker from '$lib/components/general/borrowed-item-picker.svelte';
  import { useTableState } from '../table/tableState.svelte';

  interface Props {
    updateReturneeForm: SuperValidated<Infer<UpdateReturneeSchema>>;
  }

  const { updateReturneeForm }: Props = $props();

  const tableState = useTableState();

  const form = superForm(updateReturneeForm, {
    validators: zodClient(updateReturneeSchema),
    id: 'update-returnee-form',
    onUpdate: async ({ result }) => {
      const { status, data } = result;

      switch (status) {
        case 200:
          toast.success(data.msg);
          reset();
          tableState.setActiveRow(null);
          tableState.setShowUpdate(false);
          break;
        case 401:
          toast.error(data.msg);
          break;
      }
    }
  });

  const { form: formData, enhance, submitting, reset } = form;

  $effect(() => {
    if (tableState.getShowUpdate()) {
      $formData.id = tableState.getActiveRow()?.id ?? 0;
      $formData.returned_date = tableState.getActiveRow()?.when_returned ?? '';
      $formData.time = tableState.getActiveRow()?.time ?? '';

      return () => {
        $formData.id = 0;
        $formData.returned_date = '';
        $formData.time = '';
      };
    }
  });
</script>

<Dialog.Root
  controlledOpen
  onOpenChange={() => {
    tableState.setActiveRow(null);
    tableState.setShowUpdate(false);
    reset();
  }}
  open={tableState.getShowUpdate()}
>
  <Dialog.Content class="] max-h-screen overflow-y-auto">
    <Dialog.Header>
      <Dialog.Title>Update Returnee</Dialog.Title>
      <Dialog.Description>
        Update the returnee details for <stron>{tableState.getActiveRow()?.fullname}</stron>
      </Dialog.Description>
    </Dialog.Header>

    <form method="POST" action="?/updateReturneeEvent" use:enhance>
      <input name="id" type="hidden" bind:value={$formData.id} />

      <div class="">
        <Form.Field {form} name="returned_date">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Date</Form.Label>
              <DatePicker bind:selected={$formData.returned_date} />
              <input type="hidden" {...props} bind:value={$formData.returned_date} />
            {/snippet}
          </Form.Control>
          <Form.Description />
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="time">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Time</Form.Label>
              <ComboPicker
                placeholder="Select Time"
                searchPlaceholder="Search Time"
                bind:selected={$formData.time}
                selections={timeMeta}
              />
              <input type="hidden" {...props} bind:value={$formData.time} />
            {/snippet}
          </Form.Control>
          <Form.Description />
          <Form.FieldErrors />
        </Form.Field>
      </div>

      <section class="flex justify-end">
        <Form.Button disabled={$submitting} class="relative">
          {#if $submitting}
            <div class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary">
              <LoaderCircle class="h-[20px] w-[20px] animate-spin" />
            </div>
          {/if}
          Update
        </Form.Button>
      </section>
    </form>
  </Dialog.Content>
</Dialog.Root>
