<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { deleteAccountSchema, type DeleteAccountSchema } from './schema';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import * as Form from '$lib/components/ui/form/index.js';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { toast } from 'svelte-sonner';
  import { useTableState } from '../table/tableState.svelte';

  interface Props {
    deleteAccountForm: SuperValidated<Infer<DeleteAccountSchema>>;
  }

  const { deleteAccountForm }: Props = $props();

  const tableState = useTableState();

  const form = superForm(deleteAccountForm, {
    validators: zodClient(deleteAccountSchema),
    id: 'delete-account-form',
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
      $formData.user_id = tableState.getActiveRow()?.user_id ?? '';

      return () => {
        $formData.user_id = '';
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
      <Dialog.Title>Delete Account</Dialog.Title>
      <Dialog.Description>
        You are about to delete <strong>{tableState.getActiveRow()?.fullname}</strong> with teacher
        id of
        <strong>{tableState.getActiveRow()?.teacher_id}</strong>
      </Dialog.Description>
    </Dialog.Header>

    <form method="POST" action="?/removeAccountEvent" use:enhance>
      <input type="hidden" name="user_id" bind:value={$formData.user_id} />

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
