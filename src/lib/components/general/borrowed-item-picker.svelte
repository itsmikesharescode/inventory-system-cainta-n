<script lang="ts">
  import Check from 'lucide-svelte/icons/check';
  import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
  import { tick } from 'svelte';
  import * as Command from '$lib/components/ui/command/index.js';
  import * as Popover from '$lib/components/ui/popover/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { cn } from '$lib/utils.js';
  import { page } from '$app/stores';
  import streamBorrowersUsersItems from '$lib/db-calls/streamBorrowersUsersItems';

  interface Props {
    borrowed_item_id: string;
    disabled?: boolean;
  }

  let { borrowed_item_id = $bindable(), disabled = false }: Props = $props();

  let borrowed_items = $state<Awaited<ReturnType<typeof streamBorrowersUsersItems>> | null>(null);

  const getBorrowedItems = async () => {
    if (!$page.data.supabase) return;
    borrowed_items = await streamBorrowersUsersItems($page.data.supabase);
  };

  let open = $state(false);
  let triggerRef = $state<HTMLButtonElement>(null!);

  const selectedValue = $derived(
    borrowed_items?.find((f) => f.item_id === Number(borrowed_item_id))
  );

  function closeAndFocusTrigger() {
    open = false;
    tick().then(() => {
      triggerRef.focus();
    });
  }

  $effect(() => {
    getBorrowedItems();

    return () => {
      borrowed_items = null;
    };
  });

  const checkSelected = () => {
    if (selectedValue) {
      return `${selectedValue?.teachers_tb?.user_meta_data.lastname}, ${selectedValue?.teachers_tb?.user_meta_data.firstname} ${selectedValue?.teachers_tb?.user_meta_data.middlename}`;
    }
    return 'Select a borrower';
  };
</script>

<Popover.Root bind:open>
  <Popover.Trigger {disabled} bind:ref={triggerRef}>
    {#snippet child({ props })}
      <Button
        variant="outline"
        class="w-full justify-between {borrowed_item_id ? '' : 'text-muted-foreground'}"
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
      <Command.Input {disabled} placeholder="Search borrower fullname..." />
      <Command.List>
        <Command.Empty>No borrowers found.</Command.Empty>
        <Command.Group>
          {#each borrowed_items ?? [] as borrowed_item}
            <Command.Item
              value={`${borrowed_item.teachers_tb?.user_meta_data.lastname}, ${borrowed_item.teachers_tb?.user_meta_data.firstname} ${borrowed_item.teachers_tb?.user_meta_data.middlename}`}
              onSelect={() => {
                borrowed_item_id = String(borrowed_item.id);
                closeAndFocusTrigger();
              }}
            >
              <Check
                class={cn(
                  'mr-2 size-4',
                  borrowed_item_id !== String(borrowed_item.item_id) && 'text-transparent'
                )}
              />
              <section class="flex flex-col">
                <span>
                  {`${borrowed_item.teachers_tb?.user_meta_data.lastname}, ${borrowed_item.teachers_tb?.user_meta_data.firstname} ${borrowed_item.teachers_tb?.user_meta_data.middlename}`}
                </span>
                <span class="text-xs text-muted-foreground">
                  {borrowed_item.items_tb?.model} / {borrowed_item.items_tb?.brand}
                </span>
              </section>
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
