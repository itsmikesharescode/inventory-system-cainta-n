<script lang="ts">
  import { page } from '$app/state';

  let borrowedLogs = $state<Awaited<ReturnType<typeof getBorrowedLogs>>>(null);

  const getBorrowedLogs = async () => {
    if (!page.data.supabase) return null;

    const { data, error } = await page.data.supabase
      .from('borrowed_logs_tb')
      .select('*, items_tb(*)')
      .order('created_at');

    if (error) return null;
    return data;
  };

  const getUserName = async (userId: string) => {
    if (!page.data.supabase) return null;

    const { data, error } = await page.data.supabase
      .from('teachers_tb')
      .select('user_meta_data')
      .eq('user_id', userId)
      .single();

    if (error) return null;
    return data;
  };

  $effect(() => {
    getBorrowedLogs().then((data) => (borrowedLogs = data));
    return () => (borrowedLogs = null);
  });
</script>

<div class="flex h-[30dvh] flex-col gap-2 rounded-lg border-2 p-2">
  <span class="text-sm font-semibold">Most borrowed items</span>

  <div class="flex flex-col gap-2 overflow-auto">
    {#each Object.entries(borrowedLogs?.reduce((acc: Record<string, number>, log) => {
        const model = log.items_tb.model;
        acc[model] = (acc[model] || 0) + 1;
        return acc;
      }, {}) ?? {}).sort((a, b) => b[1] - a[1]) as [model, count], index}
      <div class="relative flex flex-col rounded-lg border-[1px] p-2">
        <span class="text-sm text-muted-foreground">
          <span class="font-semibold text-black">Model:</span>
          {model}
        </span>
        <span class="text-sm text-muted-foreground">
          <span class="font-semibold text-black">Count:</span>
          {count}
        </span>

        <div class="absolute bottom-0 right-0 top-0 flex w-10 items-center justify-center">
          <div class="flex size-7 items-center justify-center rounded-full bg-primary text-white">
            {index + 1}
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<div class="flex h-[30dvh] flex-col gap-2 rounded-lg border-2 p-2">
  <span class="text-sm font-semibold">Borrowed Logs</span>

  <div class="flex flex-col gap-2 overflow-auto">
    {#each borrowedLogs ?? [] as log}
      <div class="flex flex-col rounded-lg border-[1px] p-2">
        {#await getUserName(log.user_id)}
          <span class="text-sm text-muted-foreground">loading...</span>
        {:then user}
          <span class="text-sm font-semibold"
            >{user?.user_meta_data.firstname}
            {user?.user_meta_data.middlename}
            {user?.user_meta_data.lastname}</span
          >
        {/await}
        <span class="text-sm text-muted-foreground">{log.items_tb.model}</span>
        <span class="text-sm text-muted-foreground"
          >{new Date(log.created_at).toLocaleDateString()} @ {new Date(
            log.created_at
          ).toLocaleTimeString()}</span
        >
      </div>
    {/each}
  </div>
</div>
