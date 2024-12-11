<script lang="ts">
  import Input from '../../ui/input/input.svelte';
  import * as Select from '$lib/components/ui/select/index.js';
  import Button from '$lib/components/ui/button/button.svelte';

  interface Props {
    time: string;
  }

  let { time = $bindable() }: Props = $props();

  let hours = $state('00');
  let minutes = $state('00');
  let period = $state('AM');

  const validateHours = (value: string) => {
    const num = parseInt(value);
    if (isNaN(num)) return '12';
    if (num < 1) return '01';
    if (num > 12) return '12';
    return value.padStart(2, '0');
  };

  const validateMinutes = (value: string) => {
    const num = parseInt(value);
    if (isNaN(num)) return '00';
    if (num < 0) return '00';
    if (num > 59) return '59';
    return value.padStart(2, '0');
  };

  $effect(() => {
    const now = new Date();
    let currentHours = now.getHours();
    let currentPeriod = currentHours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    currentHours = currentHours % 12;
    currentHours = currentHours ? currentHours : 12; // Handle midnight (0)

    // Update the state variables
    hours = currentHours.toString().padStart(2, '0');
    minutes = now.getMinutes().toString().padStart(2, '0');
    period = currentPeriod;

    return () => {
      hours = '00';
      minutes = '00';
      period = 'AM';
    };
  });

  const handleSave = () => {
    time = `${hours}:${minutes} ${period}`;
  };
</script>

<section class="flex items-center gap-2.5">
  <div class="flex flex-col font-medium">
    <span class="text-xs">Hours</span>
    <Input
      bind:value={hours}
      inputmode="numeric"
      type="text"
      maxlength={2}
      data-input="hours"
      class="flex w-[44px] items-center justify-center px-3 text-center"
      onblur={() => (hours = validateHours(hours))}
    />
  </div>

  <div class="flex flex-col font-medium">
    <span class="text-xs">Minutes</span>
    <Input
      bind:value={minutes}
      inputmode="numeric"
      type="text"
      maxlength={2}
      data-input="minutes"
      class="flex w-[44px] items-center justify-center px-3 text-center"
      onblur={() => (minutes = validateMinutes(minutes))}
    />
  </div>
  <div class="flex flex-col font-medium">
    <span class="text-xs">Period</span>
    <div class="flex items-center gap-2.5">
      <Select.Root type="single" bind:value={period}>
        <Select.Trigger class="w-fit">{period}</Select.Trigger>
        <Select.Content class="">
          <Select.Item value="AM">AM</Select.Item>
          <Select.Item value="PM">PM</Select.Item>
        </Select.Content>
      </Select.Root>
      <Button size="sm" onclick={handleSave}>Save</Button>
    </div>
  </div>
</section>
