<script lang="ts">
  import Table from './components/table/components/table.svelte';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import { columns } from './components/table/components/columns';
  import { initTableState } from './components/table/tableState.svelte';
  import UpdateDepartment from './components/update-department/update-department.svelte';
  import DeleteDepartment from './components/delete-department/delete-department.svelte';
  const { data } = $props();

  initTableState();
</script>

<main class="container mt-10 flex flex-col gap-5">
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
