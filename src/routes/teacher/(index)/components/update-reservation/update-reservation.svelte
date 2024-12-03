<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { updateReservationSchema, type UpdateReservationSchema } from './schema';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import Plus from 'lucide-svelte/icons/plus';
  import Textarea from '$lib/components/ui/textarea/textarea.svelte';
  import SelectPicker from '$lib/components/general/select-picker.svelte';
  import { categoriesMeta, timeMeta, typeMeta } from '$lib';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { generateRefId } from '$lib';
  import { toast } from 'svelte-sonner';
  import TeacherPicker from '$lib/components/general/teacher-picker.svelte';
  import ItemPicker from '$lib/components/general/item-picker.svelte';
  import ComboPicker from '$lib/components/general/combo-picker.svelte';
  import DatePicker from '$lib/components/general/date-picker.svelte';
  import { useTableState } from '../table/tableState.svelte';

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
      $formData.room = tableState.getActiveRow()?.room ?? '';
      $formData.date = tableState.getActiveRow()?.date ?? '';
      $formData.time = tableState.getActiveRow()?.time ?? '';
      return () => {
        $formData.id = 0;
        $formData.item_id = 0;
        $formData.quantity = 0;
        $formData.room = '';
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

        <Form.Field {form} name="room">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Room</Form.Label>
              <Input {...props} bind:value={$formData.room} placeholder="Enter Room" />
            {/snippet}
          </Form.Control>
          <Form.Description />
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="date">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Date</Form.Label>
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
              <Form.Label>Time</Form.Label>
              <ComboPicker
                placeholder="Select Time"
                bind:selected={$formData.time}
                selections={timeMeta}
              />
              <input type="hidden" {...props} bind:value={$formData.time} />
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
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>
