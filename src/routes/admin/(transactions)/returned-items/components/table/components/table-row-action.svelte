<script lang="ts" module>
  type TData = unknown;
</script>

<script lang="ts" generics="TData">
  import Ellipsis from 'lucide-svelte/icons/ellipsis';
  import Delete from 'lucide-svelte/icons/delete';
  import DatabaseBackup from 'lucide-svelte/icons/database-backup';
  import type { Row } from '@tanstack/table-core';
  import { type ReturneePageTable } from '../data/schemas';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
  import Button from '$lib/components/ui/button/button.svelte';
  import { useTableState } from '../tableState.svelte';

  let { row }: { row: Row<ReturneePageTable> } = $props();

  const tableState = useTableState();
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="ghost" class="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
        <Ellipsis />
        <span class="sr-only">Open Menu</span>
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-fit" align="end">
    <DropdownMenu.Item
      onclick={() => {
        tableState.setActiveRow(row.original);
        tableState.setShowDispose(true);
      }}
    >
      <DatabaseBackup />
      Dispose
    </DropdownMenu.Item>
    <DropdownMenu.Item
      onclick={() => {
        tableState.setActiveRow(row.original);
        tableState.setShowDelete(true);
      }}
    >
      <Delete />
      Remove
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
