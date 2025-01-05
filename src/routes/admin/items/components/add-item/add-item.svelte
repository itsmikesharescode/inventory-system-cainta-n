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
  import SelectPicker from '$lib/components/general/select-picker.svelte';
  import { categoriesMeta, typeMeta } from '$lib';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { generateRefId } from '$lib';
  import { toast } from 'svelte-sonner';
  import DepartmentPicker from '$lib/components/general/department-picker.svelte';

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

  let catSignature = $derived($formData.category.slice(0, 2).toUpperCase());
  let modelSignature = $derived($formData.model.slice(0, 2).toUpperCase());

  $effect(() => {
    catSignature;
    modelSignature;
    if (open) {
      $formData.device_id = `${catSignature}-${modelSignature}-${generateRefId()}`;
    }
  });
</script>

<Button onclick={() => (open = true)} class="items-center"><Plus /> New Item</Button>
<Dialog.Root bind:open>
  <Dialog.Content class="max-h-[80dvh] max-w-4xl overflow-y-auto">
    <Dialog.Header>
      <Dialog.Title>Add Item</Dialog.Title>
    </Dialog.Header>
    {$formData.category}
    <form method="POST" action="?/addItemEvent" use:enhance>
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
                <SelectPicker
                  placeholder="Select Category"
                  selections={categoriesMeta}
                  bind:selected={$formData.category}
                />
                <input type="hidden" {...props} bind:value={$formData.category} />
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
                <SelectPicker
                  placeholder="Select Type"
                  selections={typeMeta}
                  bind:selected={$formData.type}
                />
                <input type="hidden" {...props} bind:value={$formData.type} />
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
                <Input {...props} bind:value={$formData.brand} placeholder="Enter Brand" />
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

          <Form.Field {form} name="department">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Department</Form.Label>
                <DepartmentPicker bind:code={$formData.department} />
                <input type="hidden" {...props} bind:value={$formData.department} />
              {/snippet}
            </Form.Control>
            <Form.Description />
            <Form.FieldErrors />
          </Form.Field>
        </div>
      </section>
      <Form.Field {form} name="description">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Description</Form.Label>
            <Textarea
              rows={3}
              {...props}
              bind:value={$formData.description}
              placeholder="Enter Description"
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
          Create
        </Form.Button>
      </section>
    </form>
  </Dialog.Content>
</Dialog.Root>
