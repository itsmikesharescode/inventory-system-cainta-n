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
  import { page } from '$app/stores';
  import * as XLSX from 'xlsx';
  import { convert24Hto12H } from '$lib';
  import ArrowDownToLine from 'lucide-svelte/icons/arrow-down-to-line';
  interface Props {
    table: Table<ReturneePageTable>;
  }

  let { table }: Props = $props();

  const isFiltered = $derived(table.getState().columnFilters.length > 0);

  const downloadRecord = async () => {
    const returnees = await $page.data.getReturnees;
    if (!returnees) return;
    const worksheet = XLSX.utils.json_to_sheet(
      returnees.map((returnee) => {
        return {
          'Teacher ID': returnee.teachers_tb?.user_meta_data.teacher_id,
          'Reference ID': returnee.reference_id,
          'Full Name': `${returnee.teachers_tb?.user_meta_data.lastname}, ${returnee.teachers_tb?.user_meta_data.firstName}, ${returnee.teachers_tb?.user_meta_data.middlename}`,
          Item: returnee.item_name,
          'Date & Time Borrowed': returnee.borrowed_date,
          'Date & Time Returned': `${new Date(returnee.created_at).toLocaleDateString()} ${convert24Hto12H(returnee.created_at)}`,
          Remarks: returnee.remarks,
          'Created At': new Date(returnee.created_at)
        };
      })
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `returnees_record.xlsx`);
  };
</script>

<div class="flex items-center justify-between gap-2">
  <div class=""></div>
  <div class="flex items-center gap-2">
    <div class="flex items-center space-x-2">
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
