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
  import streamRooms from '$lib/db-calls/streamRooms';
  interface Props {
    room_id: number;
  }

  let { room_id = $bindable() }: Props = $props();

  let rooms = $state<Database['public']['Tables']['rooms_tb']['Row'][] | null>(null);

  const getRooms = async () => {
    if (!$page.data.supabase) return;
    rooms = await streamRooms($page.data.supabase);
  };

  let open = $state(false);
  let value = $state(String());
  let triggerRef = $state<HTMLButtonElement>(null!);

  const selectedValue = $derived(rooms?.find((f) => f.id.toString() === String(room_id)));

  function closeAndFocusTrigger() {
    open = false;
    tick().then(() => {
      triggerRef.focus();
    });
  }

  $effect(() => {
    tick().then(async () => {
      await getRooms();
    });
  });

  const checkSelected = () => {
    if (selectedValue) {
      return `${selectedValue?.name}`;
    }
    return 'Select a room';
  };
</script>

<Popover.Root bind:open>
  <Popover.Trigger bind:ref={triggerRef}>
    {#snippet child({ props })}
      <Button
        variant="outline"
        class="w-full justify-between {room_id ? '' : 'text-muted-foreground'}"
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
        <Command.Empty>No rooms found.</Command.Empty>
        <Command.Group>
          {#each rooms ?? [] as room}
            <Command.Item
              value={room.name}
              onSelect={() => {
                value = room.id.toString();
                room_id = room.id;
                closeAndFocusTrigger();
              }}
            >
              <Check
                class={cn(
                  'mr-2 size-4',
                  String(room_id) !== room.id.toString() && 'text-transparent'
                )}
              />
              <section class="flex flex-col">
                <span>{room.name}</span>
                <span class="text-xs text-muted-foreground">
                  {room.number}
                </span>
              </section>
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
