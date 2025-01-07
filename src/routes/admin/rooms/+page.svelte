<script lang="ts">
  import Table from './components/table/components/table.svelte';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import { columns } from './components/table/components/columns';
  import { initTableState } from './components/table/tableState.svelte';
  import UpdateRoom from './components/update-room/update-room.svelte';
  import DeleteRoom from './components/delete-room/delete-room.svelte';
  import { fly } from 'svelte/transition';
  const { data } = $props();

  initTableState();
</script>

<main class="container mt-10 flex flex-col gap-5" in:fly={{ x: -1000, duration: 300, delay: 100 }}>
  <span class="text-4xl font-semibold">Rooms</span>
  {#await data.getRooms}
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
  {:then rooms}
    <Table addRoomForm={data.addRoomForm} data={rooms ?? []} {columns} />
  {/await}
</main>

<UpdateRoom updateRoomForm={data.updateRoomForm} />
<DeleteRoom deleteRoomForm={data.deleteRoomForm} />
