<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { updateStatusReservationSchema, type UpdateStatusReservationSchema } from './schema';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import * as Form from '$lib/components/ui/form/index.js';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { toast } from 'svelte-sonner';
  import TeacherPicker from '$lib/components/general/teacher-picker.svelte';
  import { useTableState } from '../table/tableState.svelte';
  import SelectPicker from '$lib/components/general/select-picker.svelte';

  interface Props {
    updateStatusReservationForm: SuperValidated<Infer<UpdateStatusReservationSchema>>;
  }

  const { updateStatusReservationForm }: Props = $props();

  const tableState = useTableState();

  const form = superForm(updateStatusReservationForm, {
    validators: zodClient(updateStatusReservationSchema),
    id: 'update-status-reservation-form',
    onUpdate: async ({ result }) => {
      const { status, data } = result;

      switch (status) {
        case 200:
          toast.success(data.msg);
          reset();
          tableState.setActiveRow(null);
          tableState.setShowUpdateStatus(false);
          break;
        case 401:
          toast.error(data.msg);
          break;
      }
    }
  });

  const { form: formData, enhance, submitting, reset } = form;

  $effect(() => {
    if (tableState.getShowUpdateStatus()) {
      $formData.id = tableState.getActiveRow()?.id ?? 0;
      $formData.status = tableState.getActiveRow()?.status ?? '';
      $formData.item_id = tableState.getActiveRow()?.item_id ?? 0;
      return () => {
        $formData.id = 0;
        $formData.status = '';
        $formData.item_id = 0;
        reset();
      };
    }
  });
</script>

<Dialog.Root
  controlledOpen
  onOpenChange={(open) => tableState.setShowUpdateStatus(open)}
  open={tableState.getShowUpdateStatus()}
>
  <Dialog.Content class="max-h-screen overflow-y-auto">
    <Dialog.Header>
      <Dialog.Title>Update Reservation Status</Dialog.Title>
    </Dialog.Header>

    <form method="POST" action="?/updateStatusReservationEvent" use:enhance>
      <input name="id" type="hidden" {...formData} bind:value={$formData.id} />
      <input name="item_id" type="hidden" {...formData} bind:value={$formData.item_id} />
      <Form.Field {form} name="status">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Status</Form.Label>
            <SelectPicker
              bind:selected={$formData.status}
              selections={[
                { label: 'Pending', value: 'pending' },
                { label: 'Approved', value: 'approved' },
                { label: 'Rejected', value: 'rejected' }
              ]}
            />
            <input type="hidden" {...props} bind:value={$formData.status} />
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
          Update
        </Form.Button>
      </section>
    </form>
  </Dialog.Content>
</Dialog.Root>
