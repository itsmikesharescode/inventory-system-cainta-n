<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { deleteReturneeSchema, type DeleteReturneeSchema } from './schema';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import * as Form from '$lib/components/ui/form/index.js';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { toast } from 'svelte-sonner';
  import { useTableState } from '../table/tableState.svelte';

  interface Props {
    deleteReturneeForm: SuperValidated<Infer<DeleteReturneeSchema>>;
  }

  const { deleteReturneeForm }: Props = $props();

  const tableState = useTableState();

  const form = superForm(deleteReturneeForm, {
    validators: zodClient(deleteReturneeSchema),
    id: 'delete-returnee-form',
    onUpdate: async ({ result }) => {
      const { status, data } = result;

      switch (status) {
        case 200:
          toast.success(data.msg);
          reset();
          tableState.setActiveRow(null);
          tableState.setShowDelete(false);
          break;
        case 401:
          toast.error(data.msg);
          break;
      }
    }
  });

  const { form: formData, enhance, submitting, reset } = form;

  $effect(() => {
    if (tableState.getShowDelete()) {
      $formData.id = tableState.getActiveRow()?.id ?? 0;

      return () => {
        $formData.id = 0;
        tableState.setActiveRow(null);
        tableState.setShowDelete(false);
        reset();
      };
    }
  });
</script>

<Dialog.Root
  controlledOpen
  onOpenChange={(open) => {
    tableState.setShowDelete(open);
  }}
  open={tableState.getShowDelete()}
>
  <Dialog.Content class=" overflow-y-auto">
    <Dialog.Header>
      <Dialog.Title>Delete Returnee</Dialog.Title>
      <Dialog.Description>
        You are about to delete the returnee <strong>{tableState.getActiveRow()?.fullname} </strong>
        for item
        <strong>{tableState.getActiveRow()?.items_tb?.model}</strong>
      </Dialog.Description>
    </Dialog.Header>

    <form method="POST" action="?/deleteReturneeEvent" use:enhance>
      <input type="hidden" name="id" bind:value={$formData.id} />

      <section class="flex justify-end">
        <Form.Button disabled={$submitting} class="relative">
          {#if $submitting}
            <div class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary">
              <LoaderCircle class="h-[20px] w-[20px] animate-spin" />
            </div>
          {/if}
          Yes, please.
        </Form.Button>
      </section>
    </form>
  </Dialog.Content>
</Dialog.Root>
