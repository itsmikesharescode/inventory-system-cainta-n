<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { updateItemSchema, type UpdateItemSchema } from './schema';
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
  import { useTableState } from '../table/tableState.svelte';

  interface Props {
    updateItemForm: SuperValidated<Infer<UpdateItemSchema>>;
  }

  const { updateItemForm }: Props = $props();

  const tableState = useTableState();

  const form = superForm(updateItemForm, {
    validators: zodClient(updateItemSchema),
    id: 'update-item-form',
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
      $formData.device_id = tableState.getActiveRow()?.device_id ?? '';
      $formData.model = tableState.getActiveRow()?.model ?? '';
      $formData.category = tableState.getActiveRow()?.category ?? '';
      $formData.type = tableState.getActiveRow()?.type ?? '';
      $formData.status = tableState.getActiveRow()?.status ?? '';
      $formData.mr = tableState.getActiveRow()?.mr ?? '';
      $formData.brand = tableState.getActiveRow()?.brand ?? '';
      $formData.quantity = tableState.getActiveRow()?.quantity ?? 0;
      $formData.price = tableState.getActiveRow()?.price ?? 0;
      $formData.description = tableState.getActiveRow()?.description ?? '';

      return () => {
        $formData.id = 0;
        $formData.device_id = '';
        $formData.model = '';
        $formData.category = '';
        $formData.type = '';
        $formData.status = '';
        $formData.mr = '';
        $formData.brand = tableState.getActiveRow()?.brand ?? '';
        $formData.quantity = 0;
        $formData.price = 0;
        $formData.description = '';
        tableState.setActiveRow(null);
        tableState.setShowUpdate(false);
        reset();
      };
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
  <Dialog.Content class="max-h-[80dvh] max-w-4xl overflow-y-auto">
    <Dialog.Header>
      <Dialog.Title>Add Item</Dialog.Title>
    </Dialog.Header>

    <form method="POST" action="?/updateItemEvent" use:enhance>
      <input type="hidden" name="id" bind:value={$formData.id} />
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

          <Form.Field {form} name="price">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Price</Form.Label>
                <Input
                  type="number"
                  {...props}
                  bind:value={$formData.price}
                  placeholder="Enter Price"
                />
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
                rows={10}
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
