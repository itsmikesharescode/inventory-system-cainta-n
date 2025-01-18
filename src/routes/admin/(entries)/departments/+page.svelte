<script lang="ts">
  import Table from './components/table/components/table.svelte';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import { columns } from './components/table/components/columns';
  import { initTableState } from './components/table/tableState.svelte';
  import UpdateDepartment from './components/update-department/update-department.svelte';
  import DeleteDepartment from './components/delete-department/delete-department.svelte';
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
          name: 'Departments',
          url: '/admin/departments'
        }
      ]
    }
  ]);

  initTableState();
</script>

<main class="container mt-10 flex flex-col gap-5" in:fly={{ x: -1000, duration: 300, delay: 100 }}>
  <span class="text-4xl font-semibold">Departments</span>
  {#await data.getDepartments}
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
  {:then departments}
    <Table addDepartmentForm={data.addDepartmentForm} data={departments ?? []} {columns} />
  {/await}
</main>

<UpdateDepartment updateDepartmentForm={data.updateDepartmentForm} />
<DeleteDepartment deleteDepartmentForm={data.deleteDepartmentForm} />
