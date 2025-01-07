<script lang="ts">
  import AdminNav from '$lib/components/general/admin-nav.svelte';
  const { children } = $props();
</script>

<AdminNav />

<div class="overflow-hidden">
  {@render children()}
</div>
