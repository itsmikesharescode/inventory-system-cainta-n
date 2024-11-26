<script lang="ts">
  import GradualSpacing from '$lib/components/gen/GradualSpacing.svelte';
  import * as Table from '$lib/components/ui/table';
  import AddReturne from './_components/AddReturnee/AddReturne.svelte';
  import RenderReturnedItems from './_components/RenderReturnedItems.svelte';
  import ReturneeMenu from './_components/ReturneeMenu.svelte';

  const { data } = $props();
</script>

<div class="flex flex-col gap-5">
  <div class="flex">
    <GradualSpacing
      class="font-display text-left text-4xl font-bold tracking-[-0.1em]  text-black   md:leading-[5rem]"
      words="Returned Items"
    />
  </div>

  <div class="flex justify-end">
    <AddReturne addReturneForm={data.addReturneForm} />
  </div>

  <Table.Root>
    <Table.Caption>A list of your recent invoices.</Table.Caption>
    <Table.Header>
      <Table.Row>
        <Table.Head class="w-[100px]"></Table.Head>
        <Table.Head>Teacher ID</Table.Head>
        <Table.Head>Reference ID</Table.Head>
        <Table.Head>Borrower Name</Table.Head>
        <Table.Head>Returned Items</Table.Head>
        <Table.Head>Borrowed Date</Table.Head>
        <Table.Head>Returned Date</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each data.adminLayout.data?.returned_items ?? [] as returnee}
        <Table.Row>
          <Table.Cell>
            <ReturneeMenu {returnee} />
          </Table.Cell>
          <Table.Cell>{returnee.teacher_real_id}</Table.Cell>
          <Table.Cell>{returnee.reference_id}</Table.Cell>
          <Table.Cell>{returnee.borrower_name}</Table.Cell>
          <Table.Cell>
            <RenderReturnedItems {returnee} />
          </Table.Cell>
          <Table.Cell>{returnee.borrowed_date}</Table.Cell>
          <Table.Cell>{returnee.returned_date}</Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
