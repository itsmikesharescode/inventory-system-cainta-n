<script lang="ts">
  import BarChart from './components/charts/bar-chart.svelte';
  import LineChart from './components/charts/line-chart.svelte';
  import Counter from './components/counter/counter.svelte';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import MostBorrowed from './components/charts/most-borrowed.svelte';
  import LoginLogs from './components/charts/login-logs.svelte';
  const { data } = $props();
</script>

<main class="container mt-5 flex flex-col gap-10">
  {#await data.dashboardCounters}
    <section class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Skeleton class="h-[18dvh] rounded-lg" />
      <Skeleton class="h-[18dvh] rounded-lg" />
      <Skeleton class="h-[18dvh] rounded-lg" />
      <Skeleton class="h-[18dvh] rounded-lg" />
    </section>
  {:then counters}
    <section class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Counter title="Pending" count={counters?.pendings || 0} />
      <Counter title="Approved" count={counters?.approved || 0} />
      <Counter title="Rejected" count={counters?.rejected || 0} />
      <Counter title="Accounts" count={counters?.accounts || 0} />
    </section>
  {/await}
  {#await data.dashboardCounts}
    <section class="grid gap-4 md:grid-cols-2">
      <Skeleton class="h-[30dvh] rounded-lg" />
      <Skeleton class="h-[30dvh] rounded-lg" />
    </section>
  {:then counts}
    <section class="grid gap-4 md:grid-cols-2">
      <MostBorrowed />
      <LoginLogs />
      <div class="h-[30dvh]">
        <BarChart reservations={counts?.reservations || []} />
      </div>
    </section>
  {/await}
</main>
