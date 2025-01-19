<script lang="ts">
  import Table from './components/table/components/table.svelte';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import { columns } from './components/table/components/columns';
  import { initTableState } from './components/table/tableState.svelte';
  import UpdateItem from './components/update-item/update-item.svelte';
  import DeleteItem from './components/delete-item/delete-item.svelte';
  import { fly } from 'svelte/transition';
  import { useBreadCrumpRunes } from '$lib/components/general/bread-crump/state.svelte';
  import { page } from '$app/state';
  import type { PostgrestSingleResponse } from '@supabase/supabase-js';
  import type { Database } from '$lib/database.types';
  import Undo2 from 'lucide-svelte/icons/undo-2';

  const { data } = $props();

  const breadRunes = useBreadCrumpRunes();

  breadRunes.setBread([
    {
      name: 'Dashboard',
      url: '/admin',
      childLinks: [
        {
          name: 'Items',
          url: '/admin/items'
        }
      ]
    }
  ]);

  initTableState();

  type SearchResults = (Database['public']['Tables']['items_tb']['Row'] & {
    entries_categories_tb?: Database['public']['Tables']['entries_categories_tb']['Row'] | null;
    entries_departments_tb?: Database['public']['Tables']['entries_departments_tb']['Row'] | null;
  })[];

  const getSearchItems = async () => {
    if (!page.data.supabase) return null;

    const { data, error } = (await page.data.supabase.rpc('fulltext_search', {
      search_term: page.url.searchParams.get('search') ?? ''
    })) as PostgrestSingleResponse<SearchResults>;

    if (error) return null;

    return data;
  };

  const triggerSearch = $derived(page.url.searchParams.get('search'));
</script>

<main class="container mt-10 flex flex-col gap-5" in:fly={{ x: -1000, duration: 300, delay: 100 }}>
  <span class="text-4xl font-semibold">Items</span>
  {#if triggerSearch}
    <div class="flex items-center gap-2.5">
      <a
        href="/admin/items"
        class="flex items-center gap-1 underline transition-all duration-300 hover:text-primary"
      >
        <Undo2 class="size-4" />
        <span class="text-sm italic">Go back</span>
      </a>
      <span class="text-sm italic text-muted-foreground">Search results for: {triggerSearch}</span>
    </div>
  {/if}
  {#if triggerSearch}
    {#await getSearchItems()}
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
    {:then itemss}
      <Table
        addItemForm={data.addItemForm}
        data={itemss?.map((item) => ({
          id: item.id,
          created_at: item.created_at,
          device_id: item.device_id,
          department_id: item.department_id,
          category_id: item.category_id,
          category: item.entries_categories_tb?.name ?? '',
          department: item.entries_departments_tb?.code ?? '',
          model: item.model,
          type: item.type,
          status: item.status,
          brand: item.brand,
          quantity: item.quantity,
          description: item.description
        })) ?? []}
        {columns}
      />
    {/await}
  {:else}
    {#await data.items}
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
    {:then items}
      <Table
        addItemForm={data.addItemForm}
        data={items?.map((item) => ({
          id: item.id,
          created_at: item.created_at,
          device_id: item.device_id,
          department_id: item.department_id,
          category_id: item.category_id,
          category: item.entries_categories_tb?.name,
          department: item.entries_departments_tb?.code,
          model: item.model,
          type: item.type,
          status: item.status,
          brand: item.brand,
          quantity: item.quantity,
          description: item.description
        })) ?? []}
        {columns}
      />
    {/await}
  {/if}
</main>

<UpdateItem updateItemForm={data.updateItemForm} />
<DeleteItem deleteItemForm={data.deleteItemForm} />
