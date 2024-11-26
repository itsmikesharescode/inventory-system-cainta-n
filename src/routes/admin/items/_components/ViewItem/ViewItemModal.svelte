<script lang="ts">
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import { X } from 'lucide-svelte';
  import { ScrollArea } from '$lib/components/ui/scroll-area/index';
  import type { AdminLayout } from '$lib/types/admin/adminLayout.types';
  interface Props {
    item: AdminLayout['items'][number];
    showViewItem: boolean;
  }

  let { showViewItem = $bindable(), item }: Props = $props();
</script>

<AlertDialog.Root bind:open={showViewItem}>
  <AlertDialog.Content class="p-0">
    <ScrollArea class="max-h-screen md:max-h-[80dvh]">
      <button
        onclick={() => {
          showViewItem = false;
          history.back();
        }}
        class="absolute right-4 top-4 z-30 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
      >
        <X class="h-4 w-4" />
        <span class="sr-only">Close</span>
      </button>
      <AlertDialog.Header class="sticky top-0 rounded-t-lg p-5 backdrop-blur-lg">
        <AlertDialog.Title>View Item</AlertDialog.Title>
      </AlertDialog.Header>

      <div class="flex flex-col gap-2.5 p-5 pt-0">
        <div class="">
          <p class="">Device ID</p>
          <p class="text-muted-foreground">{item.device_id}</p>
        </div>

        <div class="">
          <p class="">Model</p>
          <p class="text-muted-foreground">{item.model}</p>
        </div>

        <div class="">
          <p class="">Category</p>
          <p class="text-muted-foreground">{item.category}</p>
        </div>

        <div class="">
          <p class="">Type</p>
          <p class="text-muted-foreground">{item.type}</p>
        </div>

        <div class="">
          <p class="">Status</p>
          <p class="text-muted-foreground">{item.status}</p>
        </div>

        <div class="">
          <p class="">Brand</p>
          <p class="text-muted-foreground">{item.brand}</p>
        </div>

        <div class="">
          <p class="">MR</p>
          <p class="text-muted-foreground">{item.mr}</p>
        </div>

        <div class="">
          <p class="">Price</p>
          <p class="text-muted-foreground">{item.price}</p>
        </div>

        <div class="">
          <p class="">Quantity</p>
          <p class="text-muted-foreground">{item.quantity}</p>
        </div>

        <div class="">
          <p class="">Description</p>
          <p class="text-muted-foreground">{item.description}</p>
        </div>
      </div>
    </ScrollArea>
  </AlertDialog.Content>
</AlertDialog.Root>
