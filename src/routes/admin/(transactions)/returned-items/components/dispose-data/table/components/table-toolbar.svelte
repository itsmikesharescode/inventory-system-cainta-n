<script lang="ts" module>
  type TData = unknown;
</script>

<script lang="ts" generics="TData">
  import X from 'lucide-svelte/icons/x';
  import type { Table } from '@tanstack/table-core';
  import { TableViewOptions } from './index.js';
  import Button from '$lib/components/ui/button/button.svelte';
  import { Input } from '$lib/components/ui/input/index';
  import type { DisposePageTable } from '../data/schemas.js';
  import * as XLSX from 'xlsx';
  import { convert24Hto12H } from '$lib';
  import ArrowDownToLine from 'lucide-svelte/icons/arrow-down-to-line';
  import TemplateOne from '$lib/components/general/printing-template/template-one.svelte';
  import { cn } from '$lib/utils.js';
  import type { ClassNameValue } from 'tailwind-merge';
  import Printer from 'lucide-svelte/icons/printer';
  interface Props {
    table: Table<DisposePageTable>;
    data: DisposePageTable[];
  }

  let { table, data }: Props = $props();

  const isFiltered = $derived(table.getState().columnFilters.length > 0);

  const downloadRecord = async () => {
    if (!data) return;
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((disposed) => {
        return {
          'Teacher ID': disposed.user_id,
          'Reference ID': disposed.reference_id,
          'Full Name': disposed.fullname,
          Item: disposed.item_name,
          Quantity: disposed.quantity,
          'Date & Time Borrowed': disposed.borrowed_date,
          'Date & Time Disposed': `${new Date(disposed.created_at).toLocaleDateString()} ${convert24Hto12H(disposed.created_at)}`,
          Remarks: disposed.remarks
        };
      })
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `disposed_record.xlsx`);
  };

  let openPrinter = $state(false);
</script>

<div class="flex items-center justify-between gap-2">
  <div class=""></div>
  <div class="flex items-center gap-2">
    <div class="flex items-center space-x-2">
      <Button size="sm" variant="outline" onclick={() => (openPrinter = true)}>
        <Printer /> Print
      </Button>
      <Button size="sm" variant="outline" onclick={downloadRecord}>
        <ArrowDownToLine />
        <span>Download Records</span>
      </Button>
      <Input
        placeholder="Search by fullname"
        value={(table.getColumn('fullname')?.getFilterValue() as string) ?? ''}
        oninput={(e) => {
          table.getColumn('fullname')?.setFilterValue(e.currentTarget.value);
        }}
        onchange={(e) => {
          table.getColumn('fullname')?.setFilterValue(e.currentTarget.value);
        }}
        class="h-8 w-[150px] lg:w-[250px]"
      />

      {#if isFiltered}
        <Button variant="ghost" onclick={() => table.resetColumnFilters()} class="h-8 px-2 lg:px-3">
          Clear
          <X />
        </Button>
      {/if}
    </div>
    <div class="">
      <TableViewOptions {table} />
    </div>
  </div>
</div>

{#snippet span({ title, class: className }: { title: string; class?: ClassNameValue })}
  <span
    class={cn(
      'flex items-center justify-center border-r-2 px-2 py-1 text-center text-xs  font-semibold',
      className
    )}
  >
    {title}
  </span>
{/snippet}

<TemplateOne bind:open={openPrinter}>
  {#snippet children()}
    <section>
      <div class="grid grid-cols-8 border-2">
        {@render span({ title: 'Teacher ID' })}
        {@render span({ title: 'Reference ID' })}
        {@render span({ title: 'Fullname' })}
        {@render span({ title: 'Item' })}
        {@render span({ title: 'Quantity' })}
        {@render span({ title: 'Date & Time Borrowed' })}
        {@render span({ title: 'Date & Time Returned' })}
        {@render span({ title: 'Remarks', class: 'border-r-0' })}
      </div>

      {#each data ?? [] as disposed}
        <div class="grid grid-cols-8 border-b-2">
          {@render span({
            title: disposed.user_id,
            class: 'border-l-2'
          })}
          {@render span({ title: disposed.reference_id })}
          {@render span({
            title: disposed.fullname
          })}
          {@render span({ title: disposed.item_name })}
          {@render span({ title: String(disposed.quantity) })}
          {@render span({ title: disposed.borrowed_date })}
          {@render span({
            title: `${new Date(disposed.created_at).toLocaleDateString()} ${convert24Hto12H(disposed.created_at)}`
          })}
          {@render span({ title: disposed.remarks, class: 'border-r-2' })}
        </div>
      {/each}
    </section>
  {/snippet}
</TemplateOne>
