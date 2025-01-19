<script lang="ts" module>
  type TData = unknown;
</script>

<script lang="ts" generics="TData">
  import { page } from '$app/state';
  import type { Row } from '@tanstack/table-core';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import { type AccountsPageTable } from '../data/schemas';

  let { row }: { row: Row<AccountsPageTable> } = $props();

  const getDepartmentName = async () => {
    if (!page.data.supabase) return null;
    const { data, error } = await page.data.supabase
      .from('entries_departments_tb')
      .select('*')
      .eq('id', row.original.department_id)
      .single();

    if (error) return null;
    return data;
  };
</script>

{#await getDepartmentName()}
  <Skeleton class="h-[20px] w-[100px] rounded-full" />
{:then department}
  <span>{department?.code}</span>
{/await}
