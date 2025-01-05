<script lang="ts">
  import { page } from '$app/state';
  import Badge from '$lib/components/ui/badge/badge.svelte';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  const handleGetLoginLogs = async () => {
    if (!page.data.supabase) return null;

    const { data, error } = await page.data.supabase
      .from('login_logs_tb')
      .select('*')
      .order('created_at');

    if (error) return null;
    return data;
  };

  const handleGetUserName = async (user_id: string) => {
    if (!page.data.supabase) return null;

    const { data, error } = await page.data.supabase
      .from('teachers_tb')
      .select('user_meta_data')
      .eq('user_id', user_id)
      .single();

    if (error) return null;
    return data;
  };

  const colorDetector = (direction: string) => {
    if (direction === 'logged in') return 'bg-green-500';
    if (direction === 'logged out') return 'bg-red-500';
    if (direction === 'registered') return 'bg-blue-500';
    return 'bg-primary';
  };
</script>

<div class="flex h-[30dvh] flex-col gap-2 rounded-lg border-2 p-2">
  <span class="text-2xl font-semibold text-primary">Login Logs</span>

  <div class="flex flex-col gap-2 overflow-auto">
    <!--Advent of svelte day2-->
    <!-- {#each Array(10)}
      <div class="flex flex-col rounded-lg border-[1px] p-2">
        <span class="text-sm font-semibold">Mkey roooo</span>
        <span class="text-sm text-muted-foreground"
          >{new Date().toLocaleDateString()} @ {new Date().toLocaleTimeString()}</span
        >
        <span class="text-xs text-muted-foreground">Logged in</span>
      </div>
    {/each} -->

    {#await handleGetLoginLogs()}
      <Skeleton class="h-[20px] w-[100px] rounded-full" />
    {:then loginLogs}
      {#each loginLogs ?? [] as loginLog}
        <div class="flex flex-col rounded-lg border-[1px] p-2">
          {#await handleGetUserName(loginLog.user_id)}
            <Skeleton class="h-[20px] w-full rounded-full" />
          {:then userName}
            <span class="text-sm font-semibold">
              {userName?.user_meta_data.firstname}
              {userName?.user_meta_data.lastname}
            </span>
          {/await}
          <span class="text-sm text-muted-foreground">
            {new Date(loginLog.created_at).toLocaleDateString()} @
            {new Date(loginLog.created_at).toLocaleTimeString()}
          </span>
          <Badge class="max-w-fit {colorDetector(loginLog.direction)}">
            {loginLog.direction}
          </Badge>
        </div>
      {/each}
    {/await}
  </div>
</div>
