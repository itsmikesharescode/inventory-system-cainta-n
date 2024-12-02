<script lang="ts" module>
  type TData = unknown;
</script>

<script lang="ts" generics="TData">
  import * as Popover from '$lib/components/ui/popover/index.js';
  import type { Row } from '@tanstack/table-core';
  import { type ItemsPageTable } from '../data/schemas';
  import Badge from '$lib/components/ui/badge/badge.svelte';

  let { row }: { row: Row<ItemsPageTable> } = $props();
</script>

<!-- <Popover.Root>
  <Popover.Trigger class="underline">View</Popover.Trigger>
  <Popover.Content class="w-[300px]">
    <div class="flex flex-wrap items-center gap-2">
      {#each row.original.interests as interest}
        <Badge><span class="">{interest}</span></Badge>
      {/each}
    </div>
  </Popover.Content>
</Popover.Root> -->
