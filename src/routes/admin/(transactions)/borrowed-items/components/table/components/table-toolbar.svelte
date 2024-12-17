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
  import { page } from '$app/stores';
  import * as XLSX from 'xlsx';
  import { convert24Hto12H } from '$lib';

  interface Props {
    addBorrowerForm: SuperValidated<Infer<AddBorrowerSchema>>;
    table: Table<BorrowedItemsPageTable>;
  }

  let { addBorrowerForm, table }: Props = $props();

  const isFiltered = $derived(table.getState().columnFilters.length > 0);

  const downloadRecord = async () => {
    const borrowers = await $page.data.getBorrowers;
    if (!borrowers) return;
    const worksheet = XLSX.utils.json_to_sheet(
      borrowers.map((borrower) => {
        return {
          'Teacher ID': borrower.teachers_tb?.user_meta_data.teacher_id,
          'Reference ID': borrower.reference_id,
          'Full Name': `${borrower.teachers_tb?.user_meta_data.lastname}, ${borrower.teachers_tb?.user_meta_data.firstName}, ${borrower.teachers_tb?.user_meta_data.middlename}`,
          Item: borrower.items_tb?.model,
          Quantity: borrower.items_tb?.quantity,
          Room: `${borrower.rooms_tb?.name}/ ${borrower.room_id}`,
          'Date & Time': borrower.date + ' ' + convert24Hto12H(borrower.time),
          'Created At': new Date(borrower.created_at)
        };
      })
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `borrowers_record.xlsx`);
  };
</script>

<div class="flex items-center justify-between gap-2">
  <AddBorrower {addBorrowerForm} />

  <div class="flex items-center gap-2">
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
