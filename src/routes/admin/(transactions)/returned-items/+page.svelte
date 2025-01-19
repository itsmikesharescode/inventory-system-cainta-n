<script lang="ts">
  import Table from './components/table/components/table.svelte';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import { columns } from './components/table/components/columns';
  import { initTableState } from './components/table/tableState.svelte';
  import DeleteReturnee from './components/delete-returnee/delete-returnee.svelte';
  import { fly } from 'svelte/transition';
  import * as Resizable from '$lib/components/ui/resizable/index.js';
  import { useBreadCrumpRunes } from '$lib/components/general/bread-crump/state.svelte';
  import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';

  const { data } = $props();

  const breadRunes = useBreadCrumpRunes();

  breadRunes.setBread([
    {
      name: 'Dashboard',
      url: '/admin',
      childLinks: [
        {
          name: 'Returnees',
          url: '/admin/returned-items'
        }
      ]
    }
  ]);

  initTableState();
</script>

<Resizable.PaneGroup direction="vertical" class="h-full min-w-0">
  <Resizable.Pane class="flex flex-col">
    <ScrollArea class="">
      <main
        class="container mt-10 flex flex-col gap-5"
        in:fly={{ x: -1000, duration: 300, delay: 100 }}
      >
        <span class="text-4xl font-semibold">Returnees</span>
        {#await data.returnees}
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
        {:then returnees}
          <Table
            data={returnees?.map((item) => ({
              id: item.id,
              created_at: item.created_at,
              user_id: item.user_id,
              teacher_id: item.teachers_tb?.user_id,
              room_id: item.room_id,
              item_name: item.items_tb?.model,
              quantity: item.quantity,
              reference_id: item.reference_id,
              room_name: item.entries_rooms_tb?.name + ' / ' + item.entries_rooms_tb?.number,
              remarks: item.remarks,
              teachers_tb: item.teachers_tb,
              fullname:
                item.teachers_tb?.user_meta_data?.lastname +
                ' ' +
                item.teachers_tb?.user_meta_data?.firstname +
                ' ' +
                item.teachers_tb?.user_meta_data?.middlename,
              date_borrowed: item.borrowed_date,
              date_returned: `${new Date(item.created_at).toLocaleDateString()}, ${new Date(item.created_at).toLocaleTimeString()}`
            })) ?? []}
            {columns}
          />
        {/await}
      </main>
    </ScrollArea>
  </Resizable.Pane>
  <Resizable.Handle withHandle />
  <Resizable.Pane defaultSize={15} class="flex flex-col">
    <ScrollArea class="">
      <div class="flex flex-col gap-5">
        {#each Array(30)}
          <div class="h-[20dvh] bg-red-500">wew</div>
        {/each}
      </div>
    </ScrollArea>
  </Resizable.Pane>
</Resizable.PaneGroup>

<DeleteReturnee deleteReturneeForm={data.deleteReturneeForm} />
