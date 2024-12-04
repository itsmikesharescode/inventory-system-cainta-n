<script lang="ts">
  import BarChart from './components/charts/bar-chart.svelte';
  import LineChart from './components/charts/line-chart.svelte';
  import Counter from './components/counter/counter.svelte';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';

  const { data } = $props();
</script>

<main class="container mt-5 flex flex-col gap-10">
  {#await data.dashboardCounts}
    <section class="grid gap-4 md:grid-cols-2">
      <Skeleton class="h-[30dvh] rounded-lg" />
      <Skeleton class="h-[30dvh] rounded-lg" />
    </section>
  {:then counts}
    <section class="grid gap-4 md:grid-cols-2">
      <div class="h-[30dvh]">
        <LineChart
          pendings={counts?.pendings || []}
          approved={counts?.approved || []}
          rejected={counts?.rejected || []}
        />
      </div>
      <div class="h-[30dvh]">
        <BarChart reservations={counts?.reservations || []} />
      </div>
    </section>
  {/await}

  <section class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Counter title="Pending" count={10} />
    <Counter title="Accepted" count={10} />
    <Counter title="Cancelled" count={10} />
    <Counter title="Accounts" count={10} />
  </section>
</main>
