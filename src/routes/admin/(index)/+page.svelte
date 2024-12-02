<script lang="ts">
  import Counter from './components/counter/counter.svelte';
</script>

<main class="container">
  <section class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Counter title="Pending" count={10} />
    <Counter title="Accepted" count={10} />
    <Counter title="Cancelled" count={10} />
    <Counter title="Accounts" count={10} />
  </section>
</main>
