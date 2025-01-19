<script lang="ts">
  import Table from './components/table/components/table.svelte';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import { columns } from './components/table/components/columns';
  import { initTableState } from './components/table/tableState.svelte';
  import UpdateCategory from './components/update-category/update-category.svelte';
  import DeleteCategory from './components/delete-category/delete-category.svelte';
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
          name: 'Categories',
          url: '/admin/categories'
        }
      ]
    }
  ]);

  initTableState();
</script>

<main class="container mt-10 flex flex-col gap-5" in:fly={{ x: -1000, duration: 300, delay: 100 }}>
  <span class="text-4xl font-semibold">Categories</span>
  {#await data.categories}
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
  {:then categories}
    <Table addCategoryForm={data.addCategoryForm} data={categories ?? []} {columns} />
  {/await}
</main>

<UpdateCategory updateCategoryForm={data.updateCategoryForm} />
<DeleteCategory deleteCategoryForm={data.deleteCategoryForm} />
