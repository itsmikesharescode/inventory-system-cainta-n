<script lang="ts">
  import Table from './components/table/components/table.svelte';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import { columns } from './components/table/components/columns';
  import { initTableState } from './components/table/tableState.svelte';
  import UpdateItem from './components/update-item/update-item.svelte';
  const { data } = $props();

  initTableState();
</script>

<main class="container mt-10 flex flex-col gap-5">
  <span class="text-4xl font-semibold">Items</span>
  {#await data.getItems}
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
  {:then items}
    <Table addItemForm={data.addItemForm} data={items ?? []} {columns} />
  {/await}
</main>

<UpdateItem updateItemForm={data.updateItemForm} />
