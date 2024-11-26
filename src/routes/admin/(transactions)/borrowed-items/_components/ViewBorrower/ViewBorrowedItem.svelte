<script lang="ts">
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import { X } from 'lucide-svelte';
  import { ScrollArea } from '$lib/components/ui/scroll-area/index';
  import type { AdminLayout } from '$lib/types/admin/adminLayout.types';
  import RenderBorrowedItems from '../RenderBorrowedItems.svelte';
  interface Props {
    borrower: AdminLayout['borrowed_items'][number];
    showViewBorrowedItem: boolean;
  }

  let { showViewBorrowedItem = $bindable(), borrower }: Props = $props();
</script>

<AlertDialog.Root bind:open={showViewBorrowedItem}>
  <AlertDialog.Content class="p-0">
    <ScrollArea class="max-h-screen md:max-h-[80dvh]">
      <button
        onclick={() => {
          showViewBorrowedItem = false;
          history.back();
        }}
        class="absolute right-4 top-4 z-30 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
      >
        <X class="h-4 w-4" />
        <span class="sr-only">Close</span>
      </button>
      <AlertDialog.Header class="sticky top-0 rounded-t-lg p-5 backdrop-blur-lg">
        <AlertDialog.Title>View borrowed item</AlertDialog.Title>
      </AlertDialog.Header>

      <div class="flex flex-col gap-2.5 p-5 pt-0">
        <div class="flex flex-col gap-1.5">
          <span class="">Teacher ID</span>
          <span class="text-muted-foreground">{borrower.teacher_real_id}</span>
        </div>

        <div class="flex flex-col gap-1.5">
          <span class="">Reference ID</span>
          <span class="text-muted-foreground">{borrower.reference_id}</span>
        </div>

        <div class="flex flex-col gap-1.5">
          <span class="">Borrowed Date</span>
          <span class="text-muted-foreground">{borrower.borrowed_date}</span>
        </div>

        <div class="flex flex-col gap-1.5">
          <span class="">Items Borrowed</span>
          <div class="">
            <RenderBorrowedItems {borrower} />
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <span class="">Room</span>
          <span class="text-muted-foreground">{borrower.room}</span>
        </div>
      </div>
    </ScrollArea>
  </AlertDialog.Content>
</AlertDialog.Root>
