<script lang="ts">
  import Table from './components/table/components/table.svelte';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import { columns } from './components/table/components/columns';
  import { initTableState } from './components/table/tableState.svelte';
  import UpdateReservation from './components/update-reservation/update-reservation.svelte';
  import DeleteReservation from './components/delete-reservation/delete-reservation.svelte';
  import { convert24Hto12H } from '$lib';
  const { data } = $props();

  initTableState();
</script>

<main class="container mt-10 flex flex-col gap-5">
  <span class="text-4xl font-semibold">Reservations</span>
  {#await data.getReservations}
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
  {:then reservations}
    <Table
      addReservationForm={data.addReservationForm}
      data={reservations?.map((reservation) => ({
        id: reservation.id ?? 0,
        reference_id: reservation.reference_id ?? '',
        created_at: reservation.created_at ?? '',
        item_id: reservation.item_id ?? 0,
        room_id: reservation.rooms_tb?.id ?? 0,
        room: reservation.rooms_tb?.name ?? '',
        status: reservation.status ?? '',
        quantity: reservation.quantity ?? 0,
        date: reservation.date ?? '',
        time: reservation.time ?? '',
        item: reservation.items_tb?.model ?? '',
        when: `${reservation.date} ${convert24Hto12H(reservation.time)}`
      })) ?? []}
      {columns}
    />
  {/await}
</main>

<UpdateReservation updateReservationForm={data.updateReservationForm} />
<DeleteReservation deleteReservationForm={data.deleteReservationForm} />
