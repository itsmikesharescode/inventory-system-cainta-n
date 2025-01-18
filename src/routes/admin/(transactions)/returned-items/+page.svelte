<script lang="ts">
  import Table from './components/table/components/table.svelte';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import { columns } from './components/table/components/columns';
  import { initTableState } from './components/table/tableState.svelte';
  import DeleteReturnee from './components/delete-returnee/delete-returnee.svelte';
  import { fly } from 'svelte/transition';
  const { data } = $props();
  import { useBreadCrumpRunes } from '$lib/components/general/bread-crump/state.svelte';
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

<main class="container mt-10 flex flex-col gap-5" in:fly={{ x: -1000, duration: 300, delay: 100 }}>
  <span class="text-4xl font-semibold">Returnees</span>
  {#await data.getReturnees}
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
        ...item,
        teacher_id: item.teachers_tb?.user_meta_data.teacher_id ?? '',
        fullname: `${item.teachers_tb?.user_meta_data?.lastname ?? ''}, ${item.teachers_tb?.user_meta_data?.firstname ?? ''} ${item.teachers_tb?.user_meta_data?.middlename ?? ''}`,
        date_borrowed: item.borrowed_date ?? '',
        date_returned: item.created_at ?? ''
      })) ?? []}
      {columns}
    />
  {/await}
</main>

<DeleteReturnee deleteReturneeForm={data.deleteReturneeForm} />
