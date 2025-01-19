<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { updateItemSchema, type UpdateItemSchema } from './schema';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import Textarea from '$lib/components/ui/textarea/textarea.svelte';
  import SelectPicker from '$lib/components/general/select-picker.svelte';
  import { typeMeta } from '$lib';
  import CategoryPicker from '$lib/components/general/custom-pickers/category-picker.svelte';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { toast } from 'svelte-sonner';
  import { useTableState } from '../table/tableState.svelte';
  import DepartmentPicker from '$lib/components/general/custom-pickers/department-picker.svelte';
  import { page } from '$app/state';

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

  let departments = $state<Awaited<ReturnType<typeof getDepartments>>>(null);
  let categories = $state<Awaited<ReturnType<typeof getCategories>>>(null);

  const getDepartments = async () => {
    if (!page.data.supabase) return null;
    const { data, error } = await page.data.supabase
      .from('entries_departments_tb')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return null;

    return data;
  };

  const getCategories = async () => {
    if (!page.data.supabase) return null;
    const { data, error } = await page.data.supabase
      .from('entries_categories_tb')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return null;
    return data;
  };

  $effect(() => {
    if (tableState.getShowUpdate()) {
      Promise.all([getDepartments(), getCategories()]).then(([deps, cats]) => {
        departments = deps;
        categories = cats;
      });

      $formData.id = tableState.getActiveRow()?.id ?? 0;
      $formData.device_id = tableState.getActiveRow()?.device_id ?? '';
      $formData.model = tableState.getActiveRow()?.model ?? '';
      $formData.category_id = tableState.getActiveRow()?.category_id ?? 0;
      $formData.type = tableState.getActiveRow()?.type ?? '';
      $formData.status = tableState.getActiveRow()?.status ?? '';
      $formData.brand = tableState.getActiveRow()?.brand ?? '';
      $formData.quantity = tableState.getActiveRow()?.quantity ?? 0;
      $formData.description = tableState.getActiveRow()?.description ?? '';
      $formData.department_id = tableState.getActiveRow()?.department_id ?? 0;
    }
  });
</script>

<Dialog.Root
  onOpenChange={(open) => {
    tableState.setShowUpdate(open);
  }}
  open={tableState.getShowUpdate()}
>
  <Dialog.Content class="max-h-[80dvh] max-w-2xl overflow-y-auto">
    <Dialog.Header>
      <Dialog.Title>Update Item</Dialog.Title>
    </Dialog.Header>

    <form method="POST" action="?/updateItemEvent" use:enhance>
      <input type="hidden" name="id" bind:value={$formData.id} />
      <section class="grid grid-cols-2 gap-2.5">
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

          <Form.Field {form} name="category_id">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Category</Form.Label>
                <CategoryPicker
                  bind:category_id={$formData.category_id}
                  categories={categories ?? []}
                />
                <input type="hidden" {...props} bind:value={$formData.category_id} />
              {/snippet}
            </Form.Control>
            <Form.Description />
            <Form.FieldErrors />
          </Form.Field>

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
        </div>

        <div class="">
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
                  disabled
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

          <Form.Field {form} name="department_id">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Department</Form.Label>
                <DepartmentPicker
                  bind:department_id={$formData.department_id}
                  departments={departments ?? []}
                />
                <input type="hidden" {...props} bind:value={$formData.department_id} />
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
          Update
        </Form.Button>
      </section>
    </form>
  </Dialog.Content>
</Dialog.Root>
