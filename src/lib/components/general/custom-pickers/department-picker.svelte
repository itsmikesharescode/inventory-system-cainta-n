<script lang="ts">
  import Check from 'lucide-svelte/icons/check';
  import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
  import { tick } from 'svelte';
  import * as Command from '$lib/components/ui/command/index.js';
  import * as Popover from '$lib/components/ui/popover/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { cn } from '$lib/utils.js';
  import type { Database } from '$lib/database.types';

  interface Props {
    department_id: number;
    departments: Database['public']['Tables']['entries_departments_tb']['Row'][];
  }

  let { department_id = $bindable(), departments }: Props = $props();

  let open = $state(false);
  let triggerRef = $state<HTMLButtonElement>(null!);

  const selectedValue = $derived(departments?.find((f) => f.id === department_id));

  function closeAndFocusTrigger() {
    open = false;
    tick().then(() => {
      triggerRef.focus();
    });
  }

  const checkSelected = () => {
    if (selectedValue) {
      return selectedValue.code;
    }
    return 'Select a department';
  };
</script>

<Popover.Root bind:open>
  <Popover.Trigger bind:ref={triggerRef}>
    {#snippet child({ props })}
      <Button
        variant="outline"
        class="w-full justify-between {selectedValue ? '' : 'text-muted-foreground'}"
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
      <Command.Input placeholder="Search department..." />
      <Command.List>
        <Command.Empty>No department found.</Command.Empty>
        <Command.Group>
          {#each departments ?? [] as department}
            <Command.Item
              value={`${department.name}`}
              onSelect={() => {
                department_id = department.id;
                closeAndFocusTrigger();
              }}
            >
              <Check
                class={cn('mr-2 size-4', department_id !== department.id && 'text-transparent')}
              />
              <section class="flex flex-col">
                <span class="text-sm font-medium">
                  {department.code}
                </span>
                <span class="text-xs text-muted-foreground">
                  {department.name}
                </span>
              </section>
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
