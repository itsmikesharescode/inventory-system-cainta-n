<script lang="ts">
  import { enhance } from '$app/forms';
  import GradualSpacing from '$lib/components/gen/GradualSpacing.svelte';
  import * as Table from '$lib/components/ui/table';
  import AddItemModal from './_components/AddItem/AddItemModal.svelte';
  import ItemMenu from './_components/ItemMenu.svelte';

  const { data } = $props();
</script>

<div class="flex flex-col gap-5">
  <div class="flex items-center justify-between gap-2.5">
    <GradualSpacing
      class="font-display text-left text-4xl font-bold tracking-[-0.1em]  text-black   md:leading-[5rem]"
      words="Items"
    />

    <AddItemModal addItemForm={data.addItemForm} />
  </div>

  <Table.Root>
    {#if !data.adminLayout.data?.items.length}
      <Table.Caption>No data available in the table</Table.Caption>
    {/if}
    <Table.Header>
      <Table.Row>
        <Table.Head class="w-[100px]"></Table.Head>
        <Table.Head>Model</Table.Head>
        <Table.Head>Category</Table.Head>
        <Table.Head>Brand</Table.Head>
        <Table.Head>Quantity</Table.Head>
        <Table.Head>Status</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each data.adminLayout.data?.items ?? [] as item}
        <Table.Row>
          <Table.Cell>
            <ItemMenu {item} updateItemForm={data.updateItemForm} />
          </Table.Cell>
          <Table.Cell>{item.model}</Table.Cell>
          <Table.Cell>{item.category}</Table.Cell>
          <Table.Cell>{item.brand}</Table.Cell>
          <Table.Cell>{item.quantity}</Table.Cell>
          <Table.Cell>{item.status}</Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
