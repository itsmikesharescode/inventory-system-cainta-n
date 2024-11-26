<script lang="ts">
  import { AlignJustify } from 'lucide-svelte';
  import * as Menubar from '$lib/components/ui/menubar';
  import type { Infer, SuperValidated } from 'sveltekit-superforms';
  import { pushState } from '$app/navigation';
  import type { AdminLayout } from '$lib/types/admin/adminLayout.types';
  import ViewReturneeItem from './ViewReturnee/ViewReturneeItem.svelte';
  import DeleteReturnee from './DeleteReturnee/DeleteReturnee.svelte';

  interface Props {
    /* updateBorrowerForm: SuperValidated<Infer<UpdateBorrowerSchema>>; */
    returnee: AdminLayout['returned_items'][number];
  }

  const { ...props }: Props = $props();

  let showUpdateBorrower = $state(false);
  let showDeleteReturnee = $state(false);
  let showViewReturneeItem = $state(false);
</script>

<Menubar.Root preventScroll={true} class="max-w-fit border-0">
  <Menubar.Menu>
    <Menubar.Trigger class="max-w-fit cursor-pointer data-[state=open]:bg-inherit">
      <AlignJustify class="h-[20px] w-[20px]" />
    </Menubar.Trigger>

    <Menubar.Content>
      <Menubar.Item
        onclick={() => {
          showViewReturneeItem = true;
          pushState(`/admin/returned-items/${props.returnee.id}`, {});
        }}
      >
        View
        <Menubar.Shortcut>⌘V</Menubar.Shortcut>
      </Menubar.Item>

      <Menubar.Separator />
      <!--  <Menubar.Item onclick={() => (showUpdateBorrower = true)}>
        Update
        <Menubar.Shortcut>⌘U</Menubar.Shortcut>
      </Menubar.Item> -->
      <Menubar.Separator />
      <Menubar.Item onclick={() => (showDeleteReturnee = true)}
        >Delete
        <Menubar.Shortcut>⌘D</Menubar.Shortcut>
      </Menubar.Item>
    </Menubar.Content>
  </Menubar.Menu>
</Menubar.Root>

<ViewReturneeItem returnee={props.returnee} bind:showViewReturneeItem />
<DeleteReturnee returnee={props.returnee} bind:showDeleteReturnee />
