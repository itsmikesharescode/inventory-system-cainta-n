<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { borrowItemSchema, type BorrowItemSchema } from './schema';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import Plus from 'lucide-svelte/icons/plus';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { toast } from 'svelte-sonner';
  import ItemPicker from '$lib/components/general/custom-pickers/item-picker.svelte';
  import DatePicker from '$lib/components/general/date-picker.svelte';
  import RoomPicker from '$lib/components/general/custom-pickers/room-picker.svelte';
  import { TimePicker } from '$lib/components/general/time-picker/index.js';
  import { page } from '$app/state';

  interface Props {
    borrowItemForm: SuperValidated<Infer<BorrowItemSchema>>;
  }

  const { borrowItemForm }: Props = $props();

  let open = $state(false);

  const form = superForm(borrowItemForm, {
    validators: zodClient(borrowItemSchema),
    id: 'add-borrower-form',
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

  let rooms = $state<Awaited<ReturnType<typeof getRooms>>>(null);
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

  const getItems = async () => {
    if (!page.data.supabase) return null;

    const { data, error } = await page.data.supabase
      .from('items_tb')
      .select('*, entries_departments_tb(*)')
      .order('created_at', { ascending: false });

    if (error) return null;

    return data;
  };

  $effect(() => {
    if (open) {
      Promise.all([getRooms(), getItems()]).then(([roomsData, itemsData]) => {
        rooms = roomsData;
        items = itemsData;
      });

      return () => {
        reset();
      };
    }
  });
</script>

<Button onclick={() => (open = true)} class="items-center"><Plus /> Borrow Item</Button>
<Dialog.Root bind:open>
  <Dialog.Content class="max-h-screen max-w-[650px] overflow-y-auto">
    <Dialog.Header>
      <Dialog.Title>Borrower Item</Dialog.Title>
    </Dialog.Header>

    <form method="POST" action="?/borrowItemEvent" use:enhance>
      <section class="grid gap-4 md:grid-cols-2">
        <div class="">
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

          <Form.Field {form} name="room_id">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Room</Form.Label>
                <RoomPicker bind:room_id={$formData.room_id} rooms={rooms ?? []} />
                <input type="hidden" {...props} bind:value={$formData.room_id} />
              {/snippet}
            </Form.Control>
            <Form.Description />
            <Form.FieldErrors />
          </Form.Field>
        </div>

        <div class="">
          <Form.Field {form} name="returned_date">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Returned Date</Form.Label>
                <DatePicker bind:selected={$formData.returned_date} />
                <input type="hidden" {...props} bind:value={$formData.returned_date} />
              {/snippet}
            </Form.Control>
            <Form.Description />
            <Form.FieldErrors />
          </Form.Field>

          <Form.Field {form} name="returned_time">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Returned Time</Form.Label>
                <TimePicker bind:value={$formData.returned_time} />
                <input type="hidden" {...props} bind:value={$formData.returned_time} />
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
          Borrow
        </Form.Button>
      </section>
    </form>
  </Dialog.Content>
</Dialog.Root>
