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
  import AddItem from '../../add-item/add-item.svelte';
  import type { Infer, SuperValidated } from 'sveltekit-superforms';
  import type { AddItemSchema } from '../../add-item/schema.js';
  import { Debounced } from 'runed';
  import { goto } from '$app/navigation';

  interface Props {
    addItemForm: SuperValidated<Infer<AddItemSchema>>;
    table: Table<ItemsPageTable>;
  }

  let { addItemForm, table }: Props = $props();

  let searchTerm = $state('');
  const debounced = new Debounced(() => searchTerm, 500);

  $effect(() => {
    if (debounced.current) {
      goto(`/admin/items?search=${debounced.current.split(' ').join('-')}`);
    }
  });
</script>

<div class="flex items-center justify-between gap-2">
  <AddItem {addItemForm} />

  <div class="flex items-center gap-2">
    <Input bind:value={searchTerm} placeholder="Search anything here..." />

    <!-- <div class="flex items-center space-x-2">
      <Input
        placeholder="Search by device ID"
        value={(table.getColumn('device_id')?.getFilterValue() as string) ?? ''}
        oninput={(e) => {
          table.getColumn('device_id')?.setFilterValue(e.currentTarget.value);
        }}
        onchange={(e) => {
          table.getColumn('device_id')?.setFilterValue(e.currentTarget.value);
        }}
        class="h-8 w-[150px] lg:w-[250px]"
      />

      {#if isFiltered}
        <Button variant="ghost" onclick={() => table.resetColumnFilters()} class="h-8 px-2 lg:px-3">
          Clear
          <X />
        </Button>
      {/if}
    </div> -->
    <div class="">
      <TableViewOptions {table} />
    </div>
  </div>
</div>
