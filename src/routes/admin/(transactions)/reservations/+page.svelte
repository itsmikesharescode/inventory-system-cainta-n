<script lang="ts">
  import GradualSpacing from '$lib/components/gen/GradualSpacing.svelte';
  import * as Table from '$lib/components/ui/table';
  import type { PostgrestSingleResponse } from '@supabase/supabase-js';
  import CreateReservation from './_components/CreateReservation/CreateReservation.svelte';
  import FilterData from './_components/Filter/FilterData.svelte';
  import ReservationMenu from './_components/ReservationMenu.svelte';
  import type { AdminLayout } from '$lib/types/admin/adminLayout.types';
  import { page } from '$app/stores';

  const { data } = $props();

  const filterStream = async () => {
    if ($page.url.searchParams.get('filter') === 'accepted') {
      const { data: acceptedData, error } = (await data.supabase
        .from('reservations_tb')
        .select('*')
        .eq('status', 'Accepted')) as PostgrestSingleResponse<
        AdminLayout['reservations'][number][]
      >;

      if (error) return [];
      return acceptedData;
    }

    if ($page.url.searchParams.get('filter') === 'pending') {
      const { data: pendingData, error } = (await data.supabase
        .from('reservations_tb')
        .select('*')
        .eq('status', 'Pending')) as PostgrestSingleResponse<AdminLayout['reservations'][number][]>;

      if (error) return [];
      return pendingData;
    }

    return [];
  };
</script>

<div class="flex flex-col gap-5">
  <div class="flex">
    <GradualSpacing
      class="font-display text-left text-4xl font-bold tracking-[-0.1em]  text-black   md:leading-[5rem]"
      words="Reservations"
    />
  </div>

  <div class="flex items-center justify-between gap-2.5">
    <FilterData />

    <CreateReservation createReservationForm={data.createReservationForm} />
  </div>

  <Table.Root>
    {#if !data.adminLayout.data?.reservations.length}
      <Table.Caption>No data available in the table</Table.Caption>
    {/if}
    <Table.Header>
      <Table.Row>
        <Table.Head class="w-[100px]"></Table.Head>
        <Table.Head>Teacher ID</Table.Head>
        <Table.Head>Name</Table.Head>
        <Table.Head>Items</Table.Head>
        <Table.Head>Reservation Date</Table.Head>
        <Table.Head>Rooms</Table.Head>
        <Table.Head>Status</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#if $page.url.searchParams.get('filter')}
        {#await filterStream()}
          <p>Fetching {$page.url.searchParams.get('filter')}</p>
        {:then reservations}
          {#each reservations as reservation}
            <Table.Row>
              <Table.Cell>
                <ReservationMenu updateReservationForm={data.updateReservationForm} {reservation} />
              </Table.Cell>
              <Table.Cell>{reservation.teacher_real_id}</Table.Cell>
              <Table.Cell>{reservation.teacher_name}</Table.Cell>
              <Table.Cell>{reservation.max_items}</Table.Cell>
              <Table.Cell>{reservation.time_limit}</Table.Cell>
              <Table.Cell>{reservation.room}</Table.Cell>
              <Table.Cell>{reservation.status}</Table.Cell>
            </Table.Row>
          {/each}
        {/await}
      {:else}
        {#each data.adminLayout.data?.reservations ?? [] as reservation}
          <Table.Row>
            <Table.Cell>
              <ReservationMenu updateReservationForm={data.updateReservationForm} {reservation} />
            </Table.Cell>
            <Table.Cell>{reservation.teacher_real_id}</Table.Cell>
            <Table.Cell>{reservation.teacher_name}</Table.Cell>
            <Table.Cell>{reservation.max_items}</Table.Cell>
            <Table.Cell>{reservation.time_limit}</Table.Cell>
            <Table.Cell>{reservation.room}</Table.Cell>
            <Table.Cell>{reservation.status}</Table.Cell>
          </Table.Row>
        {/each}
      {/if}
    </Table.Body>
  </Table.Root>
</div>
