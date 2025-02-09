<script lang="ts" module>
  type TData = unknown;
</script>

<script lang="ts" generics="TData">
  import X from 'lucide-svelte/icons/x';
  import type { Table } from '@tanstack/table-core';
  import { TableViewOptions } from './index.js';
  import Button from '$lib/components/ui/button/button.svelte';
  import { Input } from '$lib/components/ui/input/index';
  import type { BorrowedItemsPageTable } from '../data/schemas.js';
  import AddBorrower from '../../add-borrower/add-borrower.svelte';
  import type { Infer, SuperValidated } from 'sveltekit-superforms';
  import type { AddBorrowerSchema } from '../../add-borrower/schema.js';
  import ArrowDownToLine from 'lucide-svelte/icons/arrow-down-to-line';
  import { page } from '$app/state';
  import * as XLSX from 'xlsx';
  import { convert24Hto12H } from '$lib';
  import TemplateOne from '$lib/components/general/printing-template/template-one.svelte';
  import { cn } from '$lib/utils.js';
  import type { ClassNameValue } from 'tailwind-merge';
  import Printer from 'lucide-svelte/icons/printer';

  interface Props {
    addBorrowerForm: SuperValidated<Infer<AddBorrowerSchema>>;
    table: Table<BorrowedItemsPageTable>;
    data: BorrowedItemsPageTable[];
  }

  let { addBorrowerForm, table, data }: Props = $props();

  const isFiltered = $derived(table.getState().columnFilters.length > 0);

  const downloadRecord = async () => {
    if (!data) return;
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((borrower) => {
        return {
          'Teacher ID': borrower.teacher_id,
          'Reference ID': borrower.reference_id,
          'Full Name': borrower.fullname,
          Item: borrower.items_tb?.model,
          Quantity: borrower.items_tb?.quantity,
          Room: `${borrower.room}/ ${borrower.room_id}`,
          'Date & Time': borrower.date + ' ' + convert24Hto12H(borrower.time),
          'Created At': new Date(borrower.created_at)
        };
      })
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `borrowers_record.xlsx`);
  };

  let openPrinter = $state(false);
</script>

<div class="flex items-center justify-between gap-2">
  <AddBorrower {addBorrowerForm} />

  <div class="flex items-center gap-2">
    <Button size="sm" variant="outline" onclick={() => (openPrinter = true)}>
      <Printer /> Print
    </Button>
    <Button size="sm" variant="outline" onclick={downloadRecord}>
      <ArrowDownToLine />
      <span>Download Records</span>
    </Button>
    <div class="flex items-center space-x-2">
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
      <div class="grid grid-cols-7 border-2">
        {@render span({ title: 'Teacher ID' })}
        {@render span({ title: 'Reference ID' })}
        {@render span({ title: 'Fullname' })}
        {@render span({ title: 'Item' })}
        {@render span({ title: 'Quantity' })}
        {@render span({ title: 'Room' })}
        {@render span({ title: 'Date & Time' })}
      </div>

      {#each data ?? [] as borrower}
        <div class="grid grid-cols-7 border-b-2">
          {@render span({
            title: borrower.teacher_id,
            class: 'border-l-2'
          })}
          {@render span({ title: borrower.reference_id })}
          {@render span({
            title: borrower.fullname
          })}
          {@render span({ title: borrower.item })}
          {@render span({ title: String(borrower.items_tb?.quantity) })}
          {@render span({ title: `${borrower.room} / ${borrower.room_id}` })}
          {@render span({ title: `${borrower.date + ' ' + convert24Hto12H(borrower.time)}` })}
        </div>
      {/each}
    </section>
  {/snippet}
</TemplateOne>
