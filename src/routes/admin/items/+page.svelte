<script lang="ts">
  import Table from './components/table/components/table.svelte';
  import { columns } from './components/table/components/columns';

  const { data } = $props();
</script>

<main class="container mt-10 flex flex-col gap-5">
  <span class="text-4xl font-semibold">Items</span>
  <Table addItemForm={data.addItemForm} data={[]} {columns} />
</main>
