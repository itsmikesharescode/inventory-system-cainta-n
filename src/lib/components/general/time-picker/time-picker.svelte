<script lang="ts">
  import * as Popover from '$lib/components/ui/popover/index.js';
  import ContentTime from './content-time.svelte';
  import Clock9 from 'lucide-svelte/icons/clock-9';
  interface Props {
    placeholder?: string;
    value: string;
  }

  let { placeholder = 'Select Time', value = $bindable() }: Props = $props();
</script>

<Popover.Root>
  <Popover.Trigger
    class="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed 
    {value ? 'text-foreground' : 'text-muted-foreground'}"
  >
    <span>{value ? value : placeholder}</span>

    <Clock9 class="h-4 w-4" />
  </Popover.Trigger>
  <Popover.Content class="w-fit">
    <ContentTime bind:time={value} />
  </Popover.Content>
</Popover.Root>
