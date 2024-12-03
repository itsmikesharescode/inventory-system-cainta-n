<script lang="ts">
  import Table from './components/table/components/table.svelte';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import { columns } from './components/table/components/columns';
  import { initTableState } from './components/table/tableState.svelte';
  import TeacherPicker from '$lib/components/general/teacher-picker.svelte';

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
        user_id: reservation.user_id ?? '',
        item_id: reservation.items_tb?.id ?? 0,
        fullname: `${reservation.teachers_tb?.user_meta_data.lastname}, ${reservation.teachers_tb?.user_meta_data.firstname} ${reservation.teachers_tb?.user_meta_data.middlename}`,
        quantity: reservation.quantity,
        room: reservation.room,
        date: reservation.date,
        time: reservation.time,
        item: reservation.items_tb?.model ?? '',
        user_meta_data: reservation.teachers_tb?.user_meta_data ?? null,
        items_tb: reservation.items_tb
      })) ?? []}
      {columns}
    />
  {/await}
</main>
