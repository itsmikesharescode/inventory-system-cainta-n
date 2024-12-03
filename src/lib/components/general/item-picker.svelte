<script lang="ts">
  import Check from 'lucide-svelte/icons/check';
  import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
  import { tick } from 'svelte';
  import * as Command from '$lib/components/ui/command/index.js';
  import * as Popover from '$lib/components/ui/popover/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { cn } from '$lib/utils.js';
  import { page } from '$app/stores';
  import type { Database } from '$lib/database.types';
  import streamItems from '$lib/db-calls/streamItems';

  interface Props {
    item_id: number;
  }

  let { item_id = $bindable() }: Props = $props();

  let items = $state<Database['public']['Tables']['items_tb']['Row'][] | null>(null);

  const getItems = async () => {
    if (!$page.data.supabase) return;
    items = await streamItems($page.data.supabase);
  };

  let open = $state(false);
  let value = $state(String(item_id));
  let triggerRef = $state<HTMLButtonElement>(null!);

  const selectedValue = $derived(items?.find((f) => f.id.toString() === value));

  function closeAndFocusTrigger() {
    open = false;
    tick().then(() => {
      triggerRef.focus();
    });
  }

  $effect(() => {
    getItems();

    return () => {
      items = null;
    };
  });

  const checkSelected = () => {
    if (selectedValue) {
      return `${selectedValue?.model}`;
    }
    return 'Select an item';
  };
</script>

<Popover.Root bind:open>
  <Popover.Trigger bind:ref={triggerRef}>
    {#snippet child({ props })}
      <Button
        variant="outline"
        class="w-full justify-between {item_id ? '' : 'text-muted-foreground'}"
        {...props}
        role="combobox"
        aria-expanded={open}
      >
        {checkSelected()}
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-[300px] p-0">
    <Command.Root>
      <Command.Input placeholder="Search item model..." />
      <Command.List>
        <Command.Empty>No items found.</Command.Empty>
        <Command.Group>
          {#each items ?? [] as item}
            <Command.Item
              value={item.model}
              onSelect={() => {
                value = item.model;
                item_id = item.id;
                closeAndFocusTrigger();
              }}
            >
              <Check
                class={cn('mr-2 size-4', value !== item.id.toString() && 'text-transparent')}
              />
              <section class="flex flex-col">
                <span>{item.model}</span>
                <span class="text-xs text-muted-foreground">
                  {item.brand}/{item.quantity}
                </span>
              </section>
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
