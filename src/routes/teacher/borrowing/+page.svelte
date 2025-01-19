<script lang="ts">
  import Table from './components/table/components/table.svelte';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import { columns } from './components/table/components/columns';
  import { initTableState } from './components/table/tableState.svelte';
  import { convert24Hto12H } from '$lib';
  import { fly } from 'svelte/transition';
  const { data } = $props();

  initTableState();
</script>

<main class="container mt-10 flex flex-col gap-5" in:fly={{ x: 1000, duration: 300, delay: 100 }}>
  <span class="text-4xl font-semibold">Borrow Item</span>
  {#await data.getBorrowers}
    <section class="flex flex-col gap-2.5">
      <div class="flex items-center justify-between gap-2.5">
        <Skeleton class="h-[40px] w-[100px] rounded-lg" />
        <div class="flex items-center gap-2.5">
          <Skeleton class="h-[40px] w-[250px] rounded-lg" />
          <Skeleton class="h-[40px] w-[100px] rounded-lg" />
        </div>
      </div>

      <Skeleton class="h-[40px] w-full rounded-lg" />
    </section>
  {:then borrowers}
    <Table
      borrowItemForm={data.borrowItemForm}
      data={borrowers?.map((borrower) => ({
        room_id: borrower.room_id ?? 0,
        room_name: `${borrower.entries_rooms_tb?.name} / ${borrower.entries_rooms_tb?.number}`,
        quantity: borrower.quantity ?? 0,
        id: borrower.id,
        reference_id: borrower.reference_id,
        created_at: borrower.created_at,
        returned_date_time: borrower.date + ' ' + convert24Hto12H(borrower.time),
        user_id: borrower.user_id,
        item_id: borrower.item_id,
        date: borrower.date,
        time: borrower.time,
        item: borrower.items_tb?.model ?? '',
        items_tb: borrower.items_tb
      })) ?? []}
      {columns}
    />
  {/await}
</main>
