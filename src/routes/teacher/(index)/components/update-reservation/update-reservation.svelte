<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { updateReservationSchema, type UpdateReservationSchema } from './schema';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { toast } from 'svelte-sonner';
  import ItemPicker from '$lib/components/general/custom-pickers/item-picker.svelte';
  import DatePicker from '$lib/components/general/date-picker.svelte';
  import { useTableState } from '../table/tableState.svelte';
  import { TimePicker } from '$lib/components/general/time-picker/index';
  import { convert24Hto12H } from '$lib';
  import RoomPicker from '$lib/components/general/custom-pickers/room-picker.svelte';

  interface Props {
    updateReservationForm: SuperValidated<Infer<UpdateReservationSchema>>;
  }

  const { updateReservationForm }: Props = $props();

  const tableState = useTableState();

  const form = superForm(updateReservationForm, {
    validators: zodClient(updateReservationSchema),
    id: 'update-reservation-form',
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
      $formData.item_id = tableState.getActiveRow()?.item_id ?? 0;
      $formData.quantity = tableState.getActiveRow()?.quantity ?? 0;
      $formData.room_id = tableState.getActiveRow()?.room_id ?? 0;
      $formData.date = tableState.getActiveRow()?.date ?? '';
      $formData.time = convert24Hto12H(tableState.getActiveRow()?.time ?? '');
      return () => {
        $formData.id = 0;
        $formData.item_id = 0;
        $formData.quantity = 0;
        $formData.room_id = 0;
        $formData.date = '';
        $formData.time = '';
        reset();
      };
    }
  });
</script>

<Dialog.Root
  controlledOpen
  onOpenChange={(open) => tableState.setShowUpdate(open)}
  open={tableState.getShowUpdate()}
>
  <Dialog.Content class="max-h-screen  overflow-y-auto">
    <Dialog.Header>
      <Dialog.Title>Update Reservation</Dialog.Title>
    </Dialog.Header>

    <form method="POST" action="?/updateReservationEvent" use:enhance>
      <input name="id" type="hidden" bind:value={$formData.id} />
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
                placeholder="Enter Quantity"
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

        <Form.Field {form} name="date">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Reservation Date</Form.Label>
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
              <Form.Label>Reservation Time</Form.Label>
              <TimePicker bind:value={$formData.time} />
              <input type="hidden" {...props} bind:value={$formData.time} />
            {/snippet}
          </Form.Control>
          <Form.Description />
          <Form.FieldErrors />
        </Form.Field>

        <section class="flex justify-end">
          {#if tableState.getActiveRow()?.status !== 'approved'}
            <Form.Button disabled={$submitting} class="relative">
              {#if $submitting}
                <div
                  class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary"
                >
                  <LoaderCircle class="h-[20px] w-[20px] animate-spin" />
                </div>
              {/if}
              Update
            </Form.Button>
          {/if}
        </section>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>
