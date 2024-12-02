<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { addItemSchema, type AddItemSchema } from './schema';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import Plus from 'lucide-svelte/icons/plus';
  import Textarea from '$lib/components/ui/textarea/textarea.svelte';
  import { resetMode } from 'mode-watcher';

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

  const { form: formData, enhance, submitting, reset } = form;

  $effect(() => {
    if (!open) {
      reset();
    }
  });
</script>

<Button onclick={() => (open = true)} class="items-center"><Plus /> New Item</Button>
<Dialog.Root bind:open>
  <Dialog.Content class="max-h-[80dvh] max-w-4xl overflow-y-auto">
    <Dialog.Header>
      <Dialog.Title>Add Item</Dialog.Title>
    </Dialog.Header>

    <form method="POST" use:enhance>
      <section class="grid grid-cols-3 gap-2.5">
        <div class="">
          <Form.Field {form} name="device_id">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Device ID</Form.Label>
                <Input {...props} bind:value={$formData.device_id} placeholder="Enter Device ID" />
              {/snippet}
            </Form.Control>
            <Form.Description />
            <Form.FieldErrors />
          </Form.Field>

          <Form.Field {form} name="model">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Model</Form.Label>
                <Input {...props} bind:value={$formData.model} placeholder="Enter Model" />
              {/snippet}
            </Form.Control>
            <Form.Description />
            <Form.FieldErrors />
          </Form.Field>

          <Form.Field {form} name="category">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Category</Form.Label>
                <Input {...props} bind:value={$formData.category} placeholder="Enter Category" />
              {/snippet}
            </Form.Control>
            <Form.Description />
            <Form.FieldErrors />
          </Form.Field>
        </div>

        <div class="">
          <Form.Field {form} name="type">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Type</Form.Label>
                <Input {...props} bind:value={$formData.type} placeholder="Enter Type" />
              {/snippet}
            </Form.Control>
            <Form.Description />
            <Form.FieldErrors />
          </Form.Field>

          <Form.Field {form} name="status">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Status</Form.Label>
                <Input {...props} bind:value={$formData.status} placeholder="Enter Status" />
              {/snippet}
            </Form.Control>
            <Form.Description />
            <Form.FieldErrors />
          </Form.Field>

          <Form.Field {form} name="mr">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>MR</Form.Label>
                <Input {...props} bind:value={$formData.mr} placeholder="Enter MR" />
              {/snippet}
            </Form.Control>
            <Form.Description />
            <Form.FieldErrors />
          </Form.Field>
        </div>

        <div class="">
          <Form.Field {form} name="brand">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Brand</Form.Label>
                <Input {...props} bind:value={$formData.brand} />
              {/snippet}
            </Form.Control>
            <Form.Description />
            <Form.FieldErrors />
          </Form.Field>

          <Form.Field {form} name="quantity">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Quantity</Form.Label>
                <Input type="number" {...props} bind:value={$formData.quantity} />
              {/snippet}
            </Form.Control>
            <Form.Description />
            <Form.FieldErrors />
          </Form.Field>

          <Form.Field {form} name="price">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Price</Form.Label>
                <Input type="number" {...props} bind:value={$formData.price} />
              {/snippet}
            </Form.Control>
            <Form.Description />
            <Form.FieldErrors />
          </Form.Field>
        </div>

        <Form.Field {form} name="description">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Description</Form.Label>
              <Textarea
                {...props}
                bind:value={$formData.description}
                placeholder="Enter Description"
              />
            {/snippet}
          </Form.Control>
          <Form.Description />
          <Form.FieldErrors />
        </Form.Field>
      </section>

      <Form.Button>Create</Form.Button>
    </form>
  </Dialog.Content>
</Dialog.Root>
