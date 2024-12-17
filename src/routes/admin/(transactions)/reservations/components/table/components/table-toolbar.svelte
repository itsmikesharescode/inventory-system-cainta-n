<script lang="ts" module>
  type TData = unknown;
</script>

<script lang="ts" generics="TData">
  import X from 'lucide-svelte/icons/x';
  import type { Table } from '@tanstack/table-core';
  import { TableViewOptions } from './index.js';
  import Button from '$lib/components/ui/button/button.svelte';
  import { Input } from '$lib/components/ui/input/index';
  import type { ReservationsPageTable } from '../data/schemas.js';
  import AddReservation from '../../add-reservation/add-reservation.svelte';
  import type { Infer, SuperValidated } from 'sveltekit-superforms';
  import type { AddReservationSchema } from '../../add-reservation/schema.js';
  import ArrowDownToLine from 'lucide-svelte/icons/arrow-down-to-line';
  import { page } from '$app/stores';
  import * as XLSX from 'xlsx';
  import { convert24Hto12H } from '$lib';

  interface Props {
    addReservationForm: SuperValidated<Infer<AddReservationSchema>>;
    table: Table<ReservationsPageTable>;
  }

  let { addReservationForm, table }: Props = $props();

  const isFiltered = $derived(table.getState().columnFilters.length > 0);

  const downloadRecord = async () => {
    const reservations = await $page.data.getReservations;
    if (!reservations) return;
    const worksheet = XLSX.utils.json_to_sheet(
      reservations.map((reservation) => {
        return {
          'Teacher ID': reservation.teachers_tb?.user_meta_data.teacher_id,
          'Reference ID': reservation.reference_id,
          'Full Name': `${reservation.teachers_tb?.user_meta_data.lastname}, ${reservation.teachers_tb?.user_meta_data.firstName}, ${reservation.teachers_tb?.user_meta_data.middlename}`,
          Item: reservation.items_tb?.model,
          Quantity: reservation.items_tb?.quantity,
          Room: `${reservation.rooms_tb?.name}/ ${reservation.room_id}`,
          'Date & Time': reservation.date + ' ' + convert24Hto12H(reservation.time),
          'Created At': new Date(reservation.created_at),
          Status: reservation.status
        };
      })
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `reservations_record.xlsx`);
  };
</script>

<div class="flex items-center justify-between gap-2">
  <AddReservation {addReservationForm} />

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
