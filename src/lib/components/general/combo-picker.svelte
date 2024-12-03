<script lang="ts">
  import Check from 'lucide-svelte/icons/check';
  import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
  import { tick } from 'svelte';
  import * as Command from '$lib/components/ui/command/index.js';
  import * as Popover from '$lib/components/ui/popover/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { cn } from '$lib/utils.js';

  interface Props {
    selections: {
      value: string;
      label: string;
    }[];
    selected: string;
    placeholder?: string;
  }

  let { selected = $bindable(), selections, placeholder = 'Select an option...' }: Props = $props();

  let open = $state(false);
  let value = $state('');
  let triggerRef = $state<HTMLButtonElement>(null!);

  const selectedValue = $derived(selections.find((f) => f.value === value)?.label);

  function closeAndFocusTrigger() {
    open = false;
    tick().then(() => {
      triggerRef.focus();
    });
  }

  const checkSelected = () => {
    if (selectedValue) {
      return selectedValue;
    }
    return placeholder;
  };
</script>

<Popover.Root bind:open>
  <Popover.Trigger bind:ref={triggerRef}>
    {#snippet child({ props })}
      <Button
        variant="outline"
        class="w-full justify-between {selected ? '' : 'text-muted-foreground'}"
        {...props}
        role="combobox"
        aria-expanded={open}
      >
        {checkSelected()}
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-[200px] p-0">
    <Command.Root>
      <Command.Input placeholder="Search framework..." />
      <Command.List>
        <Command.Empty>No framework found.</Command.Empty>
        <Command.Group>
          {#each selections as selection}
            <Command.Item
              value={selection.value}
              onSelect={() => {
                value = selection.value;
                selected = selection.value;
                closeAndFocusTrigger();
              }}
            >
              <Check class={cn('mr-2 size-4', value !== selection.value && 'text-transparent')} />
              {selection.label}
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
