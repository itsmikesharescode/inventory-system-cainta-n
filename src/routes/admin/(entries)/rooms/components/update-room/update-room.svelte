<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { updateRoomSchema, type UpdateRoomSchema } from './schema';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { toast } from 'svelte-sonner';
  import { useTableState } from '../table/tableState.svelte';

  interface Props {
    updateRoomForm: SuperValidated<Infer<UpdateRoomSchema>>;
  }

  const { updateRoomForm }: Props = $props();

  const tableState = useTableState();

  const form = superForm(updateRoomForm, {
    validators: zodClient(updateRoomSchema),
    id: 'update-room-form',
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
    if (tableState.getActiveRow()) {
      $formData.id = tableState.getActiveRow()?.id ?? 0;
      $formData.name = tableState.getActiveRow()?.name ?? '';
      $formData.number = tableState.getActiveRow()?.number ?? 0;
    }
  });
</script>

<Dialog.Root
  controlledOpen
  onOpenChange={(open) => {
    tableState.setShowUpdate(open);
  }}
  open={tableState.getShowUpdate()}
>
  <Dialog.Content class="overflow-y-auto">
    <Dialog.Header>
      <Dialog.Title>Update Room</Dialog.Title>
    </Dialog.Header>

    <form method="POST" action="?/updateRoomEvent" use:enhance>
      <input type="hidden" name="id" bind:value={$formData.id} />
      <Form.Field {form} name="name">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Room Name</Form.Label>
            <Input {...props} bind:value={$formData.name} placeholder="Enter Name" />
          {/snippet}
        </Form.Control>
        <Form.Description />
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="number">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Room Number</Form.Label>
            <Input
              type="number"
              {...props}
              bind:value={$formData.number}
              placeholder="Enter Number"
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
          Update
        </Form.Button>
      </section>
    </form>
  </Dialog.Content>
</Dialog.Root>
