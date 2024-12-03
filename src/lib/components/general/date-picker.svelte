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

  const df = new DateFormatter('en-US', {
    dateStyle: 'long'
  });

  let value = $state<DateValue | undefined>(selected ? parseDate(selected) : undefined);
  let contentRef = $state<HTMLElement | null>(null);

  $effect(() => {
    if (value) {
      selected = df.format(value.toDate(getLocalTimeZone()));

      return () => {
        value = undefined;
      };
    }
  });
</script>

<Popover.Root>
  <Popover.Trigger
    class={cn(
      buttonVariants({
        variant: 'outline',
        class: 'w-full justify-start text-left font-normal'
      }),
      !value && 'text-muted-foreground'
    )}
  >
    <CalendarIcon />
    {value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
  </Popover.Trigger>
  <Popover.Content bind:ref={contentRef} class="w-auto p-0">
    <Calendar type="single" bind:value />
  </Popover.Content>
</Popover.Root>
