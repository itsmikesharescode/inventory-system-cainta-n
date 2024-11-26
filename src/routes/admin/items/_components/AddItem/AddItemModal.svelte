<script lang="ts">
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import Button from '$lib/components/ui/button/button.svelte';
  import { LoaderCircle, Plus, X } from 'lucide-svelte';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { addItemSchema, type AddItemSchema } from './schema';
  import { toast } from 'svelte-sonner';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea/index';
  import { categoriesMeta, statusMeta, typeMeta } from '../../metadata';
  import { ScrollArea } from '$lib/components/ui/scroll-area/index';
  import SelectPicker from '$lib/components/gen/SelectPicker.svelte';

  interface Props {
    addItemForm: SuperValidated<Infer<AddItemSchema>>;
  }

  const { addItemForm }: Props = $props();

  let open = $state(false);

  const form = superForm(addItemForm, {
    validators: zodClient(addItemSchema),
    id: crypto.randomUUID(),
    async onUpdate({ result }) {
      const { status, data } = result;
      switch (status) {
        case 200:
          toast.success('', { description: data.msg });
          open = false;
          break;

        case 401:
          toast.error('', { description: data.msg });
          break;
      }
    }
  });

  const { form: formData, enhance, submitting } = form;
</script>

<Button onclick={() => (open = true)} class="gap-1.5">
  <Plus class="h-[20px] w-[20px]" />
  Add Item
</Button>
<AlertDialog.Root bind:open>
  <AlertDialog.Content class="p-0">
    <ScrollArea class="max-h-screen md:max-h-[80dvh]">
      <button
        onclick={() => {
          open = false;
          form.reset();
        }}
        class="absolute right-4 top-4 z-30 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
      >
        <X class="h-4 w-4" />
        <span class="sr-only">Close</span>
      </button>

      <AlertDialog.Header class="sticky top-0 z-20 rounded-t-lg p-5 backdrop-blur-lg">
        <AlertDialog.Title>Add Item</AlertDialog.Title>
        <AlertDialog.Description>
          Kindly fill all the following fields to add an item.
        </AlertDialog.Description>
      </AlertDialog.Header>

      <form
        method="POST"
        action="?/addItemEvent"
        use:enhance
        class="flex flex-col gap-2.5 p-5 pt-0"
      >
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
                name="Select Category"
                class=""
                formProps={props}
                selections={categoriesMeta}
                bind:value={$formData.category}
              />
              <input type="hidden" name={props.name} value={$formData.category} />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="type">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Type</Form.Label>
              <SelectPicker
                name="Select Type"
                class=""
                formProps={props}
                selections={typeMeta}
                bind:value={$formData.type}
              />
              <input type="hidden" name={props.name} value={$formData.type} />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="status">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Status</Form.Label>
              <SelectPicker
                name="Select Status"
                class=""
                formProps={props}
                selections={statusMeta}
                bind:value={$formData.status}
              />
              <input type="hidden" name={props.name} value={$formData.status} />
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
                <span>Adding</span>
                <LoaderCircle class="h-[20px] w-[20px] animate-spin" />
              </div>
            {/if}

            Add Item
          </Form.Button>
        </div>
      </form>
    </ScrollArea>
  </AlertDialog.Content>
</AlertDialog.Root>
