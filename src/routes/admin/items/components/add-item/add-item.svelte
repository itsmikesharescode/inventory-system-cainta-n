<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { addItemSchema, type AddItemSchema } from './schema';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import Plus from 'lucide-svelte/icons/plus';

  interface Props {
    addItemForm: SuperValidated<Infer<AddItemSchema>>;
  }

  const { addItemForm }: Props = $props();

  let open = $state(false);

  const form = superForm(addItemForm, {
    validators: zodClient(addItemSchema),
    id: 'add-item-form',
    onUpdate: async ({ result }) => {
      const { status, data } = result;

      switch (status) {
        case 200:
          break;
        case 401:
          break;
      }
    }
  });

  const { form: formData, enhance, submitting } = form;
</script>

<Button onclick={() => (open = true)} class="items-center"><Plus /> New Item</Button>
<Dialog.Root bind:open>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Add Item</Dialog.Title>
    </Dialog.Header>

    <form method="POST" use:enhance>
      <Form.Field {form} name="device_id">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Device ID</Form.Label>
            <Input {...props} bind:value={$formData.device_id} />
          {/snippet}
        </Form.Control>
        <Form.Description />
        <Form.FieldErrors />
      </Form.Field>
    </form>
  </Dialog.Content>
</Dialog.Root>
