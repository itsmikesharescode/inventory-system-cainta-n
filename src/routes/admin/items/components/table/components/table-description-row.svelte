<script lang="ts" module>
  type TData = unknown;
</script>

<script lang="ts" generics="TData">
  import type { Row } from '@tanstack/table-core';
  import { type ItemsPageTable } from '../data/schemas';
  import * as Popover from '$lib/components/ui/popover/index.js';

  let { row }: { row: Row<ItemsPageTable> } = $props();
</script>

<Popover.Root>
  <Popover.Trigger>
    <span class="text-sm text-primary underline">View Description</span>
  </Popover.Trigger>
  <Popover.Content class="max-h-[40dvh] overflow-auto">
    <pre class="font-roboto text-wrap text-sm">{row.original.description}</pre>
  </Popover.Content>
</Popover.Root>
