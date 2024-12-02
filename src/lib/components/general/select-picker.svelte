<script lang="ts">
  import * as Select from '$lib/components/ui/select/index.js';

  interface Props {
    placeholder?: string;
    selected: string;
    selections: {
      value: string;
      label: string;
    }[];
  }

  let { selected = $bindable(), selections, placeholder = 'Select an option' }: Props = $props();
</script>

<Select.Root type="single" bind:value={selected}>
  <Select.Trigger class="">
    {selections.find((s) => s.value === selected)?.label || placeholder}
  </Select.Trigger>
  <Select.Content>
    {#each selections as selection}
      <Select.Item value={selection.value}>{selection.label}</Select.Item>
    {/each}
  </Select.Content>
</Select.Root>
