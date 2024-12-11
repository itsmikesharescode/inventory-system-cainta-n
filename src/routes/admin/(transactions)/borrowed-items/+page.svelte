<script lang="ts">
  import Table from './components/table/components/table.svelte';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import { columns } from './components/table/components/columns';
  import { initTableState } from './components/table/tableState.svelte';
  import UpdateBorrower from './components/update-borrower/update-borrower.svelte';
  import DeleteBorrower from './components/delete-borrower/delete-borrower.svelte';
  import { convert24Hto12H } from '$lib';
  const { data } = $props();

  initTableState();
</script>

<main class="container mt-10 flex flex-col gap-5">
  <span class="text-4xl font-semibold">Borrowers</span>
  {#await data.getBorrowers}
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
  {:then borrowers}
    <Table
      addBorrowerForm={data.addBorrowerForm}
      data={borrowers?.map((borrower) => ({
        room_id: borrower.rooms_tb?.id ?? 0,
        room: borrower.rooms_tb?.name ?? '',
        id: borrower.id,
        reference_id: borrower.reference_id,
        created_at: borrower.created_at,
        teacher_id: borrower.teachers_tb?.user_meta_data?.teacher_id ?? '',
        when: borrower.date + ' ' + convert24Hto12H(borrower.time),
        user_id: borrower.user_id,
        item_id: borrower.item_id,
        fullname: `${borrower.teachers_tb?.user_meta_data.lastname}, ${borrower.teachers_tb?.user_meta_data.firstname} ${borrower.teachers_tb?.user_meta_data.middlename}`,
        date: borrower.date,
        time: borrower.time,
        item: borrower.items_tb?.model ?? '',
        user_meta_data: borrower.teachers_tb?.user_meta_data ?? null,
        items_tb: borrower.items_tb
      })) ?? []}
      {columns}
    />
  {/await}
</main>

<UpdateBorrower updateBorrowerForm={data.updateBorrowerForm} />
<DeleteBorrower deleteBorrowerForm={data.deleteBorrowerForm} />
