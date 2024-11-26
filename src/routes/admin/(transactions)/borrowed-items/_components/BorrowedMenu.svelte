<script lang="ts">
  import { AlignJustify } from 'lucide-svelte';
  import * as Menubar from '$lib/components/ui/menubar';
  import type { Infer, SuperValidated } from 'sveltekit-superforms';
  import { pushState } from '$app/navigation';
  import type { AdminLayout } from '$lib/types/admin/adminLayout.types';
  import ViewBorrowedItem from './ViewBorrower/ViewBorrowedItem.svelte';
  import type { UpdateBorrowerSchema } from './UpdateBorrower/schema';
  import UpdateBorrowedItem from './UpdateBorrower/UpdateBorrowedItem.svelte';
  import DeleteBorrower from './DeleteBorrower/DeleteBorrower.svelte';

  interface Props {
    updateBorrowerForm: SuperValidated<Infer<UpdateBorrowerSchema>>;
    borrower: AdminLayout['borrowed_items'][number];
  }

  const { ...props }: Props = $props();

  let showUpdateBorrower = $state(false);
  let showDeleteBorrower = $state(false);
  let showViewBorrowedItem = $state(false);
</script>

<Menubar.Root preventScroll={true} class="max-w-fit border-0">
  <Menubar.Menu>
    <Menubar.Trigger class="max-w-fit cursor-pointer data-[state=open]:bg-inherit">
      <AlignJustify class="h-[20px] w-[20px]" />
    </Menubar.Trigger>

    <Menubar.Content>
      <Menubar.Item
        onclick={() => {
          showViewBorrowedItem = true;
          pushState(`/admin/borrowed-items/${props.borrower.id}`, {});
        }}
      >
        View
        <Menubar.Shortcut>⌘V</Menubar.Shortcut>
      </Menubar.Item>

      <Menubar.Separator />
      <Menubar.Item onclick={() => (showUpdateBorrower = true)}>
        Update
        <Menubar.Shortcut>⌘U</Menubar.Shortcut>
      </Menubar.Item>
      <Menubar.Separator />
      <Menubar.Item onclick={() => (showDeleteBorrower = true)}
        >Delete
        <Menubar.Shortcut>⌘D</Menubar.Shortcut>
      </Menubar.Item>
    </Menubar.Content>
  </Menubar.Menu>
</Menubar.Root>

<ViewBorrowedItem borrower={props.borrower} bind:showViewBorrowedItem />
<UpdateBorrowedItem
  borrower={props.borrower}
  updateBorrowerForm={props.updateBorrowerForm}
  bind:showUpdateBorrower
/>
<DeleteBorrower borrower={props.borrower} bind:showDeleteBorrower />
