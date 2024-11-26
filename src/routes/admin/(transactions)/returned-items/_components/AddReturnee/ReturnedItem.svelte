<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Popover from '$lib/components/ui/popover';
  import { fromSupabaseState } from '$lib/runes/supabaseState.svelte';
  import type { AdminLayout } from '$lib/types/admin/adminLayout.types';
  import type { PostgrestSingleResponse } from '@supabase/supabase-js';
  import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
  import { toast } from 'svelte-sonner';

  type Items = AdminLayout['items'][number];
  type BorrowedItem = AdminLayout['borrowed_items'][number];
  interface Props {
    selectedItems: Items[];
    referenceId: string;
  }

  let { selectedItems = $bindable(), referenceId }: Props = $props();

  const supabase = fromSupabaseState();
  const sb = supabase.get();

  const streamBorrowedItems = async () => {
    if (!sb) return null;

    const { data, error } = (await sb
      .from('borrowed_items_tb')
      .select('*')
      .eq('reference_id', referenceId)
      .limit(1)
      .single()) as PostgrestSingleResponse<BorrowedItem>;
    if (error) return null;
    return data;
  };

  const checkIfExist = (id: number) => {
    const idRef = selectedItems.map((item) => item.id);

    if (idRef.includes(id)) return 'bg-primary text-white';
    return 'bg-secondary';
  };
</script>

<div
  class="relative flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid]:border-destructive [&>span]:line-clamp-1 data-[placeholder]:[&>span]:text-muted-foreground"
>
  <!--Render selected items here-->
  <div class="flex flex-wrap items-center gap-1.5 overflow-hidden">
    {#each selectedItems as item (item)}
      <button
        title="Click to remove {item.category} ({item.brand})"
        onclick={() => {
          selectedItems = selectedItems.filter((itemRef) => itemRef.id !== item.id);
        }}
        type="button"
        class="truncate bg-secondary p-2"
      >
        <span>{item.category} ({item.brand})</span>
      </button>
    {/each}
  </div>

  <Popover.Root>
    <Popover.Trigger class=" absolute right-2 top-0 bg-primary px-2 text-xs text-white"
      >Borrowed Items</Popover.Trigger
    >
    <Popover.Content>
      <p class="text-sm text-muted-foreground">Borrowed Items</p>
      <ScrollArea class="h-[35dvh]">
        {#await streamBorrowedItems()}
          <p>Fetching items from database</p>
        {:then item}
          <div class="flex flex-col gap-1.5">
            {#each item?.items_borrowed ?? [] as itemBorrowed}
              <button
                onclick={() => {
                  const idRef = selectedItems.map((item) => item.id);

                  if (idRef.includes(itemBorrowed.id)) {
                    return toast.warning('', {
                      description: 'Item already selected click the item outside to unselect.'
                    });
                  }
                  selectedItems.push(itemBorrowed);
                  selectedItems = selectedItems;
                  return;
                }}
                type="button"
                class="{checkIfExist(itemBorrowed.id)}
                   p-2 text-left transition-all"
              >
                <span class="text-xs">{itemBorrowed.category}({itemBorrowed.brand})</span>
              </button>
            {/each}
          </div>
        {/await}
      </ScrollArea>
    </Popover.Content>
  </Popover.Root>
</div>
