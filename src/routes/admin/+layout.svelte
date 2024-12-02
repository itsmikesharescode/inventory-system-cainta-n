<script lang="ts">
  import AdminNav from '$lib/components/general/admin-nav.svelte';
  const { children } = $props();
</script>

<AdminNav />

{@render children()}

<style>
  :global(body) {
    font-family: 'Roboto', sans-serif;
  }
</style>
