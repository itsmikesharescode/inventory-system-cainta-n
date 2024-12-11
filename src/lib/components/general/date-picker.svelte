<script lang="ts">
  import CalendarIcon from 'lucide-svelte/icons/calendar';
  import {
    DateFormatter,
    type DateValue,
    getLocalTimeZone,
    parseDate
  } from '@internationalized/date';
  import { cn } from '$lib/utils.js';
  import { buttonVariants } from '$lib/components/ui/button/index.js';
  import { Calendar } from '$lib/components/ui/calendar/index.js';
  import * as Popover from '$lib/components/ui/popover/index.js';

  interface Props {
    selected: string;
  }

  let { selected = $bindable() }: Props = $props();

  function formatDate(
    dateStr: string,
    style: 'full' | 'long' | 'medium' | 'short' = 'long'
  ): string {
    try {
      const df = new DateFormatter('en-US', { dateStyle: style });
      const parsedDate = parseDate(dateStr);
      return df.format(parsedDate.toDate(getLocalTimeZone()));
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateStr; // Return original string if parsing fails
    }
  }

  let contentRef = $state<HTMLElement | null>(null);

  const read = $derived(selected ? formatDate(selected) : 'Pick a date');
</script>

<Popover.Root>
  <Popover.Trigger
    class={cn(
      buttonVariants({
        variant: 'outline',
        class: 'w-full justify-start text-left font-normal'
      }),
      !selected && 'text-muted-foreground'
    )}
  >
    <CalendarIcon />
    {read}
  </Popover.Trigger>
  <Popover.Content bind:ref={contentRef} class="w-auto p-0">
    <Calendar
      onValueChange={(v) => {
        if (!v) return (selected = '');
        selected = v.toString();
      }}
      type="single"
    />
  </Popover.Content>
</Popover.Root>
