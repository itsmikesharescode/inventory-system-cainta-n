<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { addReturneeSchema, type AddReturneeSchema } from './schema';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import * as Form from '$lib/components/ui/form/index.js';
  import Plus from 'lucide-svelte/icons/plus';
  import { timeMeta } from '$lib';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { toast } from 'svelte-sonner';
  import ComboPicker from '$lib/components/general/combo-picker.svelte';
  import DatePicker from '$lib/components/general/date-picker.svelte';
  import BorrowedItemPicker from '$lib/components/general/borrowed-item-picker.svelte';
  import { TimePicker } from '$lib/components/general/time-picker';
  import { Textarea } from '$lib/components/ui/textarea/index.js';

  interface Props {
    addReturneeForm: SuperValidated<Infer<AddReturneeSchema>>;
  }

  const { addReturneeForm }: Props = $props();

  let open = $state(false);

  const form = superForm(addReturneeForm, {
    validators: zodClient(addReturneeSchema),
    id: 'add-returnee-form',
    onUpdate: async ({ result }) => {
      const { status, data } = result;

      switch (status) {
        case 200:
          toast.success(data.msg);
          reset();
          open = false;
          break;
        case 401:
          toast.error(data.msg);
          break;
      }
    }
  });

  const { form: formData, enhance, submitting, reset } = form;
</script>

<Button onclick={() => (open = true)} class="items-center"><Plus /> New Borrower</Button>
<Dialog.Root
  controlledOpen
  onOpenChange={() => {
    open = false;
    reset();
  }}
  bind:open
>
  <Dialog.Content class="max-h-screen max-w-[650px] overflow-y-auto">
    <Dialog.Header>
      <Dialog.Title>Add Returnee</Dialog.Title>
    </Dialog.Header>

    <form method="POST" action="?/addReturneeEvent" use:enhance>
      <section class="grid gap-4 md:grid-cols-2">
        <div class="">
          <Form.Field {form} name="borrowed_item_id">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Borrower</Form.Label>
                <BorrowedItemPicker bind:borrowed_item_id={$formData.borrowed_item_id} />
                <input type="hidden" {...props} bind:value={$formData.borrowed_item_id} />
              {/snippet}
            </Form.Control>
            <Form.Description />
            <Form.FieldErrors />
          </Form.Field>

          <Form.Field {form} name="returned_date">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Date Returned</Form.Label>
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
                <Form.Label>Time Returned</Form.Label>
                <TimePicker bind:value={$formData.time} />
                <input type="hidden" {...props} bind:value={$formData.time} />
              {/snippet}
            </Form.Control>
            <Form.Description />
            <Form.FieldErrors />
          </Form.Field>
        </div>

        <div class="">
          <Form.Field {form} name="remarks">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Remarks</Form.Label>
                <Textarea {...props} bind:value={$formData.remarks} placeholder="Enter Remarks" />
              {/snippet}
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
        </div>
      </section>

      <section class="flex justify-end">
        <Form.Button disabled={$submitting} class="relative">
          {#if $submitting}
            <div class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary">
              <LoaderCircle class="h-[20px] w-[20px] animate-spin" />
            </div>
          {/if}
          Create
        </Form.Button>
      </section>
    </form>
  </Dialog.Content>
</Dialog.Root>
