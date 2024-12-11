<script lang="ts">
  import Table from './components/table/components/table.svelte';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import { columns } from './components/table/components/columns';
  import { initTableState } from './components/table/tableState.svelte';
  import UpdateReturnee from './components/update-returnee/update-returnee.svelte';
  import DeleteReturnee from './components/delete-returnee/delete-returnee.svelte';
  import { convert24Hto12H } from '$lib';
  const { data } = $props();

  initTableState();
</script>

<main class="container mt-10 flex flex-col gap-5">
  <span class="text-4xl font-semibold">Returnees</span>
  {#await data.getReturnees}
    <section class="flex flex-col gap-2.5">
      <div class="flex items-center justify-between gap-2.5">
        <Skeleton class="h-[40px] w-[100px] rounded-lg" />
        <div class="flex items-center gap-2.5">
          <Skeleton class="h-[40px] w-[250px] rounded-lg" />
          <Skeleton class="h-[40px] w-[100px] rounded-lg" />
        </div>
      </div>

      <Skeleton class="h-[40px] w-full rounded-lg" />
    </section>
  {:then returnees}
    <Table
      addReturneeForm={data.addReturneeForm}
      data={returnees?.map((returnee) => ({
        returned_date: returnee.returned_date,
        teacher_id: returnee.borrowed_items_tb?.teachers_tb?.user_meta_data.teacher_id ?? '',
        remarks: returnee.remarks,
        id: returnee.id,
        created_at: returnee.created_at,
        reference_id: returnee.borrowed_items_tb?.reference_id ?? '',
        when_borrowed:
          returnee.borrowed_items_tb?.date +
          ' ' +
          convert24Hto12H(returnee.borrowed_items_tb?.time),
        time: returnee.time,
        when_returned: returnee.returned_date + ' ' + convert24Hto12H(returnee.time),
        user_id: returnee.borrowed_items_tb?.teachers_tb?.user_id ?? '',
        item_id: returnee.borrowed_items_tb?.item_id ?? 0,
        fullname: `${returnee.borrowed_items_tb?.teachers_tb?.user_meta_data.lastname}, ${returnee.borrowed_items_tb?.teachers_tb?.user_meta_data.firstname} ${returnee.borrowed_items_tb?.teachers_tb?.user_meta_data.middlename}`,
        room: returnee.borrowed_items_tb?.room ?? '',
        item: returnee.borrowed_items_tb?.items_tb?.model ?? '',
        user_meta_data: returnee.borrowed_items_tb?.teachers_tb?.user_meta_data ?? null,
        items_tb: returnee.borrowed_items_tb?.items_tb ?? null
      })) ?? []}
      {columns}
    />
  {/await}
</main>

<UpdateReturnee updateReturneeForm={data.updateReturneeForm} />
<DeleteReturnee deleteReturneeForm={data.deleteReturneeForm} />
