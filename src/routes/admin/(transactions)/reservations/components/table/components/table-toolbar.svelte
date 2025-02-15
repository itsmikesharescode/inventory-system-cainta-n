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
  import { page } from '$app/state';
  import Printer from 'lucide-svelte/icons/printer';
  import * as XLSX from 'xlsx';
  import { convert24Hto12H } from '$lib';
  import TemplateOne from '$lib/components/general/printing-template/template-one.svelte';
  import { cn } from '$lib/utils.js';
  import type { ClassNameValue } from 'tailwind-merge';

  interface Props {
    addReservationForm: SuperValidated<Infer<AddReservationSchema>>;
    table: Table<ReservationsPageTable>;
    data: ReservationsPageTable[];
  }

  let { addReservationForm, table, data }: Props = $props();

  const isFiltered = $derived(table.getState().columnFilters.length > 0);

  const downloadRecord = async () => {
    if (!data) return;
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((reservation) => {
        return {
          'Teacher ID': reservation.teacher_id,
          'Reference ID': reservation.reference_id,
          'Full Name': reservation.fullname,
          Item: reservation.items_tb?.model,
          Quantity: reservation.items_tb?.quantity,
          Room: `${reservation.room}/ ${reservation.room_id}`,
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

  let openPrinter = $state(false);
</script>

<div class="flex items-center justify-between gap-2">
  <AddReservation {addReservationForm} />

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
      <div class="grid grid-cols-8 border-2">
        {@render span({ title: 'Teacher ID' })}
        {@render span({ title: 'Reference ID' })}
        {@render span({ title: 'Fullname' })}
        {@render span({ title: 'Item' })}
        {@render span({ title: 'Quantity' })}
        {@render span({ title: 'Room' })}
        {@render span({ title: 'Date & Time' })}
        {@render span({ title: 'Status', class: 'border-r-0' })}
      </div>

      {#each data ?? [] as reservation}
        <div class="grid grid-cols-8 border-b-2">
          {@render span({
            title: reservation.teacher_id,
            class: 'border-l-2'
          })}
          {@render span({ title: reservation.reference_id })}
          {@render span({
            title: reservation.fullname
          })}
          {@render span({ title: reservation.item })}
          {@render span({ title: String(reservation.items_tb?.quantity) })}
          {@render span({ title: `${reservation.room}/ ${reservation.room_id}` })}
          {@render span({ title: reservation.date + ' ' + convert24Hto12H(reservation.time) })}
          {@render span({ title: reservation.status, class: 'border-r-2' })}
        </div>
      {/each}
    </section>
  {/snippet}
</TemplateOne>
