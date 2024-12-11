<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { updateDepartmentSchema, type UpdateDepartmentSchema } from './schema';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { toast } from 'svelte-sonner';
  import { useTableState } from '../table/tableState.svelte';

  interface Props {
    updateDepartmentForm: SuperValidated<Infer<UpdateDepartmentSchema>>;
  }

  const { updateDepartmentForm }: Props = $props();

  const tableState = useTableState();

  const form = superForm(updateDepartmentForm, {
    validators: zodClient(updateDepartmentSchema),
    id: 'update-department-form',
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
      $formData.code = tableState.getActiveRow()?.code ?? '';
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
      <Dialog.Title>Update Department</Dialog.Title>
    </Dialog.Header>

    <form method="POST" action="?/updateDepartmentEvent" use:enhance>
      <input type="hidden" name="id" bind:value={$formData.id} />
      <Form.Field {form} name="name">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Department Name</Form.Label>
            <Input {...props} bind:value={$formData.name} placeholder="Enter Name" />
          {/snippet}
        </Form.Control>
        <Form.Description />
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="code">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Department Code</Form.Label>
            <Input {...props} bind:value={$formData.code} placeholder="Enter Code" />
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
