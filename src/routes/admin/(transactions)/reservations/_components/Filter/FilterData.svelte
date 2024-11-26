<script lang="ts">
  import { goto } from '$app/navigation';
  import SelectPicker from '$lib/components/gen/SelectPicker.svelte';
  import { Label } from '$lib/components/ui/label/index.js';

  let chosenValue = $state('All');

  const selections = [
    {
      value: 'All',
      label: 'Will show all reservations'
    },
    {
      value: 'Accepted',
      label: 'Will show only accepted reservations'
    },
    {
      value: 'Pending',
      label: 'Will show only pending reservations'
    },

    {
      value: 'Canceled',
      label: 'Will show only calceled reservations'
    }
  ];

  $effect(() => {
    if (chosenValue === 'Accepted') goto('?filter=accepted', { invalidateAll: false });
    else if (chosenValue === 'Pending') goto('?filter=pending', { invalidateAll: false });
    else if (chosenValue === 'Canceled') goto('?filter=canceled', { invalidateAll: false });
    else goto('/admin/reservations', { invalidateAll: false });
  });
</script>

<div class="">
  <div class="flex w-[200px] items-center gap-2.5">
    <Label for="email">Filter</Label>
    <SelectPicker
      formProps={null}
      name="Select filter"
      class=""
      bind:value={chosenValue}
      {selections}
    />
  </div>
</div>
