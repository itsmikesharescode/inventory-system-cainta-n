<script lang="ts">
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import { X } from 'lucide-svelte';
  import { ScrollArea } from '$lib/components/ui/scroll-area/index';
  import type { AdminLayout } from '$lib/types/admin/adminLayout.types';
  import RenderReturnedItems from '../RenderReturnedItems.svelte';

  interface Props {
    returnee: AdminLayout['returned_items'][number];
    showViewReturneeItem: boolean;
  }

  let { showViewReturneeItem = $bindable(), returnee }: Props = $props();
</script>

<AlertDialog.Root bind:open={showViewReturneeItem}>
  <AlertDialog.Content class="p-0">
    <ScrollArea class="max-h-screen md:max-h-[80dvh]">
      <button
        onclick={() => {
          showViewReturneeItem = false;
          history.back();
        }}
        class="absolute right-4 top-4 z-30 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
      >
        <X class="h-4 w-4" />
        <span class="sr-only">Close</span>
      </button>
      <AlertDialog.Header class="sticky top-0 rounded-t-lg p-5 backdrop-blur-lg">
        <AlertDialog.Title>View returnee item</AlertDialog.Title>
      </AlertDialog.Header>

      <div class="flex flex-col gap-2.5 p-5 pt-0">
        <div class="flex flex-col gap-1.5">
          <span class="">Teacher ID</span>
          <span class="text-muted-foreground">{returnee.teacher_real_id}</span>
        </div>

        <div class="flex flex-col gap-1.5">
          <span class="">Reference ID</span>
          <span class="text-muted-foreground">{returnee.reference_id}</span>
        </div>

        <div class="flex flex-col gap-1.5">
          <span class="">Borrower Name</span>
          <span class="text-muted-foreground">{returnee.borrower_name}</span>
        </div>

        <div class="flex flex-col gap-1.5">
          <span class="">Returned Items</span>
          <div class="">
            <RenderReturnedItems {returnee} />
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <span class="">Borrowed Date</span>
          <span class="text-muted-foreground">{returnee.borrowed_date}</span>
        </div>

        <div class="flex flex-col gap-1.5">
          <span class=""> Returned Date</span>
          <span class="text-muted-foreground">{returnee.returned_date}</span>
        </div>
      </div>
    </ScrollArea>
  </AlertDialog.Content>
</AlertDialog.Root>
