<script lang="ts">
  import Table from './table/components/table.svelte';
  import { columns } from './table/components/columns';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import type { Database } from '$lib/database.types';
  import { page } from '$app/state';

  const disposes = $derived(page.data.disposes) as Promise<
    | (Database['public']['Tables']['transaction_dispose_tb']['Row'] & {
        teachers_tb?: Database['public']['Tables']['teachers_tb']['Row'] | null;
        items_tb?: Database['public']['Tables']['items_tb']['Row'] | null;
        entries_rooms_tb?: Database['public']['Tables']['entries_rooms_tb']['Row'] | null;
      })[]
    | null
  >;
</script>

<main class="container mt-10 flex flex-col gap-5">
  <span class="text-4xl font-semibold">Disposed</span>
  {#await disposes}
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
  {:then disposes}
    <Table
      data={disposes?.map((disposed) => ({
        id: disposed.id,
        created_at: disposed.created_at,
        user_id: disposed.user_id,
        fullname:
          (disposed.teachers_tb?.user_meta_data?.lastname ?? '') +
          (disposed.teachers_tb?.user_meta_data?.firstname ?? '') +
          (disposed.teachers_tb?.user_meta_data?.middlename ?? ''),
        item_id: disposed.item_id,
        item_name: disposed.items_tb?.model ?? '',
        room_id: disposed.room_id,
        room_name:
          disposed.entries_rooms_tb?.name + ' / ' + (disposed.entries_rooms_tb?.number ?? ''),
        reference_id: disposed.reference_id,
        quantity: disposed.quantity,
        remarks: disposed.remarks,
        borrowed_date: disposed.borrowed_date
      })) ?? []}
      {columns}
    />
  {/await}
</main>
