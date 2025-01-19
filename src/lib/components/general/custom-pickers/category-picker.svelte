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
    category_id: number;
    categories: Database['public']['Tables']['entries_categories_tb']['Row'][];
  }

  let { category_id = $bindable(), categories }: Props = $props();

  let open = $state(false);
  let triggerRef = $state<HTMLButtonElement>(null!);

  const selectedValue = $derived(categories?.find((f) => f.id === category_id));

  function closeAndFocusTrigger() {
    open = false;
    tick().then(() => {
      triggerRef.focus();
    });
  }

  const checkSelected = () => {
    if (selectedValue) {
      return selectedValue.name;
    }
    return 'Select a category';
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
        <Command.Empty>No category found.</Command.Empty>
        <Command.Group>
          {#each categories ?? [] as category}
            <Command.Item
              value={`${category.name}`}
              onSelect={() => {
                category_id = category.id;
                closeAndFocusTrigger();
              }}
            >
              <Check class={cn('mr-2 size-4', category_id !== category.id && 'text-transparent')} />

              <span class="text-sm font-medium">
                {category.name}
              </span>
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
