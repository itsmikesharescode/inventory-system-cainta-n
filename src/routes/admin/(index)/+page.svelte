<script lang="ts">
  import BarChart from './components/charts/bar-chart.svelte';
  import LineChart from './components/charts/line-chart.svelte';
  import Counter from './components/counter/counter.svelte';
</script>

<main class="container mt-5 flex flex-col gap-10">
  <section class="grid h-[30dvh] grid-cols-2 gap-4">
    <div class="">
      <LineChart />
    </div>
    <div class="">
      <BarChart />
    </div>
  </section>

  <section class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Counter title="Pending" count={10} />
    <Counter title="Accepted" count={10} />
    <Counter title="Cancelled" count={10} />
    <Counter title="Accounts" count={10} />
  </section>
</main>
