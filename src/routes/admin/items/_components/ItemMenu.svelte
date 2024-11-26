<script lang="ts">
  import { AlignJustify } from 'lucide-svelte';
  import * as Menubar from '$lib/components/ui/menubar';
  import UpdateItemModal from './UpdateItem/UpdateItemModal.svelte';
  import type { Infer, SuperValidated } from 'sveltekit-superforms';
  import type { UpdateItemSchema } from './UpdateItem/schema';
  import DeleteItemModal from './DeleteItem/DeleteItemModal.svelte';
  import ViewItemModal from './ViewItem/ViewItemModal.svelte';
  import { goto, preloadData, pushState } from '$app/navigation';
  import type { AdminLayout } from '$lib/types/admin/adminLayout.types';

  interface Props {
    updateItemForm: SuperValidated<Infer<UpdateItemSchema>>;
    item: AdminLayout['items'][number];
  }

  const { updateItemForm, item }: Props = $props();

  let showUpdateItem = $state(false);
  let showDeleteItem = $state(false);
  let showViewItem = $state(false);
</script>

<Menubar.Root preventScroll={true} class="max-w-fit border-0">
  <Menubar.Menu>
    <Menubar.Trigger class="max-w-fit cursor-pointer data-[state=open]:bg-inherit">
      <AlignJustify class="h-[20px] w-[20px]" />
    </Menubar.Trigger>

    <Menubar.Content>
      <Menubar.Item
        onclick={() => {
          showViewItem = true;
          pushState(`/admin/items/${item.id}`, {});
        }}
      >
        View
        <Menubar.Shortcut>⌘V</Menubar.Shortcut>
      </Menubar.Item>

      <Menubar.Separator />
      <Menubar.Item onclick={() => (showUpdateItem = true)}>
        Update
        <Menubar.Shortcut>⌘U</Menubar.Shortcut>
      </Menubar.Item>
      <Menubar.Separator />
      <Menubar.Item onclick={() => (showDeleteItem = true)}
        >Delete
        <Menubar.Shortcut>⌘D</Menubar.Shortcut>
      </Menubar.Item>
    </Menubar.Content>
  </Menubar.Menu>
</Menubar.Root>

<ViewItemModal {item} bind:showViewItem />
<UpdateItemModal {item} {updateItemForm} bind:showUpdateItem />
<DeleteItemModal {item} bind:showDeleteItem />
