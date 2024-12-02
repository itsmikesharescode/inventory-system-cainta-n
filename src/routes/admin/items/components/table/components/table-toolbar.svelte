<script lang="ts" module>
  type TData = unknown;
</script>

<script lang="ts" generics="TData">
  import X from 'lucide-svelte/icons/x';
  import type { Table } from '@tanstack/table-core';
  import { TableViewOptions } from './index.js';
  import Button from '$lib/components/ui/button/button.svelte';
  import { Input } from '$lib/components/ui/input/index';
  import type { ItemsPageTable } from '../data/schemas.js';

  let { table }: { table: Table<ItemsPageTable> } = $props();

  const isFiltered = $derived(table.getState().columnFilters.length > 0);
  const statusCol = $derived(table.getColumn('status'));
  const priorityCol = $derived(table.getColumn('priority'));
</script>

<div class="flex items-center justify-between">
  <div class="flex flex-1 items-center space-x-2">
    <Input
      placeholder="Search by full name"
      value={(table.getColumn('firstName')?.getFilterValue() as string) ?? ''}
      oninput={(e) => {
        table.getColumn('firstName')?.setFilterValue(e.currentTarget.value);
      }}
      onchange={(e) => {
        table.getColumn('firstName')?.setFilterValue(e.currentTarget.value);
      }}
      class="h-8 w-[150px] lg:w-[250px]"
    />

    {#if isFiltered}
      <Button variant="ghost" onclick={() => table.resetColumnFilters()} class="h-8 px-2 lg:px-3">
        Reset
        <X />
      </Button>
    {/if}
  </div>
  <TableViewOptions {table} />
</div>
