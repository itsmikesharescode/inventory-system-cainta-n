<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { updateBorrowerSchema, type UpdateBorrowerSchema } from './schema';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { toast } from 'svelte-sonner';
  import TeacherPicker from '$lib/components/general/custom-pickers/teacher-picker.svelte';
  import ItemPicker from '$lib/components/general/custom-pickers/item-picker.svelte';
  import DatePicker from '$lib/components/general/date-picker.svelte';
  import { useTableState } from '../table/tableState.svelte';
  import { TimePicker } from '$lib/components/general/time-picker/index.js';
  import { convert24Hto12H } from '$lib';
  import RoomPicker from '$lib/components/general/custom-pickers/room-picker.svelte';
  import { page } from '$app/state';

  interface Props {
    updateBorrowerForm: SuperValidated<Infer<UpdateBorrowerSchema>>;
  }

  const { updateBorrowerForm }: Props = $props();

  const tableState = useTableState();

  const form = superForm(updateBorrowerForm, {
    validators: zodClient(updateBorrowerSchema),
    id: 'update-borrower-form',
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

  let rooms = $state<Awaited<ReturnType<typeof getRooms>>>(null);
  let teachers = $state<Awaited<ReturnType<typeof getTeachers>>>(null);
  let items = $state<Awaited<ReturnType<typeof getItems>>>(null);

  const getRooms = async () => {
    if (!page.data.supabase) return null;
    const { data, error } = await page.data.supabase
      .from('entries_rooms_tb')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return null;
    return data;
  };

  const getTeachers = async () => {
    if (!page.data.supabase) return null;
    const { data, error } = await page.data.supabase
      .from('teachers_tb')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return null;
    return data;
  };

  const getItems = async () => {
    if (!page.data.supabase) return null;
    const { data, error } = await page.data.supabase
      .from('items_tb')
      .select('*, entries_categories_tb(*)')
      .order('created_at', { ascending: false });

    if (error) return null;
    return data;
  };

  $effect(() => {
    if (tableState.getShowUpdate()) {
      Promise.all([getRooms(), getTeachers(), getItems()]).then(
        ([roomsData, teachersData, itemsData]) => {
          rooms = roomsData;
          teachers = teachersData;
          items = itemsData;
        }
      );

      $formData.id = tableState.getActiveRow()?.id ?? 0;
      $formData.date = tableState.getActiveRow()?.date ?? '';
      $formData.time = convert24Hto12H(tableState.getActiveRow()?.time ?? '');
      $formData.room_id = tableState.getActiveRow()?.room_id ?? 0;
      $formData.user_id = tableState.getActiveRow()?.user_id ?? '';
      $formData.item_id = tableState.getActiveRow()?.item_id ?? 0;
      $formData.quantity = tableState.getActiveRow()?.quantity ?? 0;

      return () => {
        $formData.id = tableState.getActiveRow()?.id ?? 0;
        $formData.user_id = tableState.getActiveRow()?.user_id ?? '';
        $formData.item_id = tableState.getActiveRow()?.item_id ?? 0;
        $formData.room_id = tableState.getActiveRow()?.room_id ?? 0;
        $formData.date = tableState.getActiveRow()?.date ?? '';
        $formData.time = tableState.getActiveRow()?.time ?? '';
        $formData.quantity = tableState.getActiveRow()?.quantity ?? 0;
        reset();
      };
    }
  });
</script>

<Dialog.Root
  onOpenChange={(open) => {
    tableState.setShowUpdate(open);
  }}
  open={tableState.getShowUpdate()}
>
  <Dialog.Content class="max-h-screen max-w-[650px] overflow-y-auto">
    <Dialog.Header>
      <Dialog.Title>Update Borrower</Dialog.Title>
    </Dialog.Header>

    <form method="POST" action="?/updateBorrowerEvent" use:enhance>
      <input name="id" type="hidden" bind:value={$formData.id} />
      <section class="grid gap-4 md:grid-cols-2">
        <div class="">
          <Form.Field {form} name="user_id">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Teacher</Form.Label>
                <TeacherPicker bind:user_id={$formData.user_id} {teachers} />
                <input type="hidden" {...props} bind:value={$formData.user_id} />
              {/snippet}
            </Form.Control>
            <Form.Description />
            <Form.FieldErrors />
          </Form.Field>

          <Form.Field {form} name="item_id">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Item</Form.Label>
                <ItemPicker bind:item_id={$formData.item_id} items={items ?? []} />
                <input type="hidden" {...props} bind:value={$formData.item_id} />
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
                  placeholder="Enter quantity"
                />
              {/snippet}
            </Form.Control>
            <Form.Description />
            <Form.FieldErrors />
          </Form.Field>
        </div>

        <div class="">
          <Form.Field {form} name="room_id">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Room</Form.Label>
                <RoomPicker bind:room_id={$formData.room_id} {rooms} />
                <input type="hidden" {...props} bind:value={$formData.room_id} />
              {/snippet}
            </Form.Control>
            <Form.Description />
            <Form.FieldErrors />
          </Form.Field>

          <Form.Field {form} name="date">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Borrowed Date</Form.Label>
                <DatePicker bind:selected={$formData.date} />
                <input type="hidden" {...props} bind:value={$formData.date} />
              {/snippet}
            </Form.Control>
            <Form.Description />
            <Form.FieldErrors />
          </Form.Field>

          <Form.Field {form} name="time">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Borrowed Time</Form.Label>
                <TimePicker bind:value={$formData.time} />
                <input type="hidden" {...props} bind:value={$formData.time} />
              {/snippet}
            </Form.Control>
            <Form.Description />
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
          Update
        </Form.Button>
      </section>
    </form>
  </Dialog.Content>
</Dialog.Root>
