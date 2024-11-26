<script lang="ts">
  import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import type { AdminLayout } from '$lib/types/admin/adminLayout.types';

  interface Props {
    returnee: AdminLayout['returned_items'][number];
  }

  const { returnee }: Props = $props();
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger class="underline">View Items</DropdownMenu.Trigger>
  <DropdownMenu.Content class="max-w-fit">
    {#each returnee.returned_items as itemBorrowed}
      <DropdownMenu.Group>
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            <span>{itemBorrowed.model}</span>
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent class="flex w-[290px] flex-col gap-2.5 p-4 text-sm">
            <span>Type: <i class="text-muted-foreground">{itemBorrowed.type}</i></span>
            <span>Status: <i class="text-muted-foreground">{itemBorrowed.status}</i></span>
            <span>Brand: <i class="text-muted-foreground">{itemBorrowed.brand}</i></span>
            <span>Device ID: <i class="text-muted-foreground">{itemBorrowed.device_id}</i></span>
            <span>Category: <i class="text-muted-foreground">{itemBorrowed.category}</i></span>
            <span
              >Price: <i class="text-muted-foreground">{itemBorrowed.price.toLocaleString()}</i
              ></span
            >

            <div class="max-h-[20dvh] overflow-auto">
              <span
                >Description: <i class="text-muted-foreground">{itemBorrowed.description} </i>
              </span>
            </div>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
      </DropdownMenu.Group>
      <DropdownMenu.Separator />
    {/each}
  </DropdownMenu.Content>
</DropdownMenu.Root>
