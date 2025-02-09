<script lang="ts" module>
  type TData = unknown;
</script>

<script lang="ts" generics="TData">
  import X from 'lucide-svelte/icons/x';
  import type { Table } from '@tanstack/table-core';
  import { TableViewOptions } from './index.js';
  import Button from '$lib/components/ui/button/button.svelte';
  import { Input } from '$lib/components/ui/input/index';
  import type { ReturneePageTable } from '../data/schemas.js';
  import * as XLSX from 'xlsx';
  import ArrowDownToLine from 'lucide-svelte/icons/arrow-down-to-line';
  import TemplateOne from '$lib/components/general/printing-template/template-one.svelte';
  import { cn } from '$lib/utils.js';
  import type { ClassNameValue } from 'tailwind-merge';
  import Printer from 'lucide-svelte/icons/printer';
  interface Props {
    table: Table<ReturneePageTable>;
    data: ReturneePageTable[];
  }

  let { table, data }: Props = $props();

  const isFiltered = $derived(table.getState().columnFilters.length > 0);

  const downloadRecord = async () => {
    if (!data) return;
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((returnee) => {
        return {
          'Teacher ID': returnee.teacher_id,
          'Reference ID': returnee.reference_id,
          'Full Name': returnee.fullname,
          Item: returnee.item_name,
          Quantity: returnee.quantity,
          'Date & Time Borrowed': returnee.date_borrowed,
          'Date & Time Returned': returnee.date_returned,
          Remarks: returnee.remarks,
          'Created At': new Date(returnee.created_at)
        };
      })
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `returnees_record.xlsx`);
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

      {#each data ?? [] as returnee}
        <div class="grid grid-cols-8 border-b-2">
          {@render span({
            title: returnee.teacher_id,
            class: 'border-l-2'
          })}
          {@render span({ title: returnee.reference_id })}
          {@render span({
            title: returnee.fullname
          })}
          {@render span({ title: returnee.item_name })}
          {@render span({ title: String(returnee.quantity) })}
          {@render span({ title: returnee.date_borrowed })}
          {@render span({ title: returnee.date_returned })}
          {@render span({ title: returnee.remarks, class: 'border-r-2' })}
        </div>
      {/each}
    </section>
  {/snippet}
</TemplateOne>
