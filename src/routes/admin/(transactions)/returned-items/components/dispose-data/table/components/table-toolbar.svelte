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
  import { page } from '$app/state';
  import * as XLSX from 'xlsx';
  import { convert24Hto12H } from '$lib';
  import ArrowDownToLine from 'lucide-svelte/icons/arrow-down-to-line';
  import type { Database } from '$lib/database.types';
  interface Props {
    table: Table<DisposePageTable>;
  }

  let { table }: Props = $props();

  const isFiltered = $derived(table.getState().columnFilters.length > 0);

  const disposes = page.data.disposes as Promise<
    | (Database['public']['Tables']['transaction_dispose_tb']['Row'] & {
        teachers_tb?: Database['public']['Tables']['teachers_tb']['Row'] | null;
        items_tb?: Database['public']['Tables']['items_tb']['Row'] | null;
        entries_rooms_tb?: Database['public']['Tables']['entries_rooms_tb']['Row'] | null;
      })[]
    | null
  >;

  const downloadRecord = async () => {
    const disps = await disposes;
    if (!disps) return;
    const worksheet = XLSX.utils.json_to_sheet(
      disps.map((disposed) => {
        return {
          'Teacher ID': disposed.user_id,
          'Reference ID': disposed.reference_id,
          'Full Name':
            (disposed.teachers_tb?.user_meta_data?.lastname ?? '') +
            (disposed.teachers_tb?.user_meta_data?.firstname ?? '') +
            (disposed.teachers_tb?.user_meta_data?.middlename ?? ''),
          Item: disposed.items_tb?.model,
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
