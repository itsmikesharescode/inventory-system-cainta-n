<script lang="ts">
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import { LoaderCircle, Plus, X } from 'lucide-svelte';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { updateItemSchema, type UpdateItemSchema } from './schema';
  import { toast } from 'svelte-sonner';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea/index';
  import { categoriesMeta, statusMeta, typeMeta } from '../../metadata';
  import { ScrollArea } from '$lib/components/ui/scroll-area/index';
  import type { AdminLayout } from '$lib/types/admin/adminLayout.types';
  import { Item } from '$lib/components/ui/accordion';
  import SelectPicker from '$lib/components/gen/SelectPicker.svelte';

  interface Props {
    item: AdminLayout['items'][number];
    updateItemForm: SuperValidated<Infer<UpdateItemSchema>>;
    showUpdateItem: boolean;
  }

  let { updateItemForm, item, showUpdateItem = $bindable() }: Props = $props();

  const form = superForm(updateItemForm, {
    validators: zodClient(updateItemSchema),
    id: crypto.randomUUID(),
    async onUpdate({ result }) {
      const { status, data } = result;
      switch (status) {
        case 200:
          toast.success('', { description: data.msg });
          showUpdateItem = false;
          break;

        case 401:
          toast.error('', { description: data.msg });
          break;
      }
    }
  });

  const { form: formData, enhance, submitting } = form;

  $effect(() => {
    if (showUpdateItem) {
      $formData.brand = item.brand;
      $formData.category = item.category;
      $formData.description = item.description;
      $formData.deviceId = item.device_id;
      $formData.model = item.model;
      $formData.mr = item.mr;
      $formData.price = item.price;
      $formData.quantity = item.quantity;
      $formData.status = item.status;
      $formData.type = item.type;
    }
  });
</script>

<AlertDialog.Root bind:open={showUpdateItem}>
  <AlertDialog.Content class="p-0">
    <ScrollArea class="max-h-screen md:max-h-[80dvh]">
      <button
        onclick={() => {
          showUpdateItem = false;
          form.reset();
        }}
        class="absolute right-4 top-4 z-30 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
      >
        <X class="h-4 w-4" />
        <span class="sr-only">Close</span>
      </button>

      <AlertDialog.Header class="sticky top-0 z-20 rounded-t-lg p-5 backdrop-blur-lg">
        <AlertDialog.Title>Update Item</AlertDialog.Title>
        <AlertDialog.Description>
          Kindly fill all the following fields to update an item.
        </AlertDialog.Description>
      </AlertDialog.Header>

      <form
        method="POST"
        action="?/updateItemEvent"
        use:enhance
        class="flex flex-col gap-2.5 p-5 pt-0"
      >
        <Form.Field {form} name="itemId" class="hidden">
          <Form.Control>
            {#snippet children({ props })}
              <Input {...props} bind:value={item.id} />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="deviceId">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Device ID</Form.Label>
              <Input {...props} bind:value={$formData.deviceId} placeholder="Enter device id" />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="model">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Model</Form.Label>
              <Input {...props} bind:value={$formData.model} placeholder="Enter model" />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="category">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Category</Form.Label>
              <SelectPicker
                formProps={props}
                name="Select Category"
                class=""
                selections={categoriesMeta}
                bind:value={$formData.category}
              />
              <input type="hidden" bind:value={$formData.category} name={props.name} />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="type">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Type</Form.Label>
              <SelectPicker
                formProps={props}
                name="Select Type"
                class=""
                selections={typeMeta}
                bind:value={$formData.type}
              />
              <input type="hidden" bind:value={$formData.type} name={props.name} />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="status">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Status</Form.Label>
              <SelectPicker
                formProps={props}
                name="Select Status"
                class=""
                selections={statusMeta}
                bind:value={$formData.status}
              />
              <input type="hidden" bind:value={$formData.status} name={props.name} />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="mr">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>MR</Form.Label>
              <Input {...props} bind:value={$formData.mr} placeholder="Enter mr" />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="brand">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Brand</Form.Label>
              <Input {...props} bind:value={$formData.brand} placeholder="Enter brand" />
            {/snippet}
          </Form.Control>
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
                placeholder="Enter quantity"
              />
            {/snippet}
          </Form.Control>
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
                placeholder="Enter price"
              />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="description">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Description</Form.Label>
              <Textarea
                {...props}
                bind:value={$formData.description}
                placeholder="Enter description"
              />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <div class="sticky bottom-[1rem] left-0 right-0 flex justify-end">
          <Form.Button disabled={$submitting} class="relative  max-w-fit">
            {#if $submitting}
              <div
                class="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center gap-1.5 rounded-lg bg-primary"
              >
                <span>Wait</span>
                <LoaderCircle class="h-[20px] w-[20px] animate-spin" />
              </div>
            {/if}

            Update Item
          </Form.Button>
        </div>
      </form>
    </ScrollArea>
  </AlertDialog.Content>
</AlertDialog.Root>
