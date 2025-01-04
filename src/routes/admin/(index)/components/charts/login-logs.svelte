<script lang="ts">
</script>

<div class="flex h-[30dvh] flex-col gap-2 rounded-lg border-2 p-2">
  <span class="text-2xl font-semibold text-primary">Login Logs</span>

  <div class="flex flex-col gap-2 overflow-auto">
    <!--Advent of svelte day2-->
    {#each Array(10)}
      <div class="flex flex-col rounded-lg border-[1px] p-2">
        <span class="text-sm font-semibold">Mkey roooo</span>
        <span class="text-sm text-muted-foreground"
          >{new Date().toLocaleDateString()} @ {new Date().toLocaleTimeString()}</span
        >
        <span class="text-xs text-muted-foreground">Logged in</span>
      </div>
    {/each}
  </div>
</div>
