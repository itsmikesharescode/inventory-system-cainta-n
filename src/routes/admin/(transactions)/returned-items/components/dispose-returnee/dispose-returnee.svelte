<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { disposeReturneeSchema, type DisposeReturneeSchema } from './schema';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { toast } from 'svelte-sonner';
  import { Textarea } from '$lib/components/ui/textarea/index.js';
  import { useTableState } from '../table/tableState.svelte';

  interface Props {
    disposeReturneeForm: SuperValidated<Infer<DisposeReturneeSchema>>;
  }

  const { disposeReturneeForm }: Props = $props();

  const tableState = useTableState();

  const form = superForm(disposeReturneeForm, {
    validators: zodClient(disposeReturneeSchema),
    id: 'dispose-returnee-form',
    onUpdate: async ({ result }) => {
      const { status, data } = result;

      switch (status) {
        case 200:
          toast.success(data.msg);
          reset();
          tableState.setActiveRow(null);
          tableState.setShowDispose(false);
          break;
        case 401:
          toast.error(data.msg);
          break;
      }
    }
  });

  const { form: formData, enhance, submitting, reset } = form;
</script>

<Dialog.Root
  open={tableState.getShowDispose()}
  onOpenChange={() => {
    tableState.setActiveRow(null);
    tableState.setShowDispose(false);
    form.reset();
  }}
>
  <Dialog.Content class="max-h-screen max-w-[650px] overflow-y-auto">
    <Dialog.Header>
      <Dialog.Title>Dispose Returnee</Dialog.Title>
    </Dialog.Header>

    <form method="POST" action="?/disposeReturneeEvent" use:enhance>
      <input name="id" type="hidden" value={tableState.getActiveRow()?.id} />
      <input name="user_id" type="hidden" value={tableState.getActiveRow()?.user_id} />
      <input name="item_id" type="hidden" value={tableState.getActiveRow()?.item_id} />
      <input name="reference_id" type="hidden" value={tableState.getActiveRow()?.reference_id} />
      <input name="room_id" type="hidden" value={tableState.getActiveRow()?.room_id} />
      <input name="borrowed_date" type="hidden" value={tableState.getActiveRow()?.date_borrowed} />

      <Form.Field {form} name="remarks">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Remarks</Form.Label>
            <Textarea
              {...props}
              bind:value={$formData.remarks}
              placeholder="Say something about the condition of the item..."
            />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="quantity">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Quantity</Form.Label>
            <Input
              oninput={(e: Event) => {
                const node = e.target as HTMLInputElement;
                if (Number(node.value) > (tableState.getActiveRow()?.quantity ?? 0)) {
                  node.value = (tableState.getActiveRow()?.quantity ?? 0).toString();
                }
              }}
              type="number"
              {...props}
              bind:value={$formData.quantity}
            />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <section class="flex justify-end">
        <Form.Button disabled={$submitting} class="relative">
          {#if $submitting}
            <div class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary">
              <LoaderCircle class="h-[20px] w-[20px] animate-spin" />
            </div>
          {/if}
          Dispose
        </Form.Button>
      </section>
    </form>
  </Dialog.Content>
</Dialog.Root>
