<script lang="ts">
  import TeacherNav from '$lib/components/general/teacher-nav.svelte';
  const { children } = $props();
</script>

<TeacherNav />

{@render children()}

<style>
  :global(body) {
    font-family: 'Roboto', sans-serif;
  }
</style>
