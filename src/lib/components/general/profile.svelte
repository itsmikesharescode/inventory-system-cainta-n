<script lang="ts">
  import * as Popover from '$lib/components/ui/popover';
  import CircleUser from 'lucide-svelte/icons/circle-user';
  import LogOut from 'lucide-svelte/icons/log-out';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import Badge from '../ui/badge/badge.svelte';
  import Button from '../ui/button/button.svelte';
  import { page } from '$app/state';
  import { invalidateAll } from '$app/navigation';
  import { toast } from 'svelte-sonner';

  let loader = $state(false);
  const handleLogout = async () => {
    if (!page.data.supabase || !page.data.user) return invalidateAll();
    loader = true;

    if (page.data.user.user_metadata.role === 'teacher') {
      //speed run logging haha
      await page.data.supabase.from('login_logs_tb').insert({
        user_id: page.data.user.id,
        direction: 'logged out'
      });
    }

    const { error } = await page.data.supabase.auth.signOut();
    if (error) return toast.error('Failed to logout');
    invalidateAll();
    loader = false;
  };

  const user = $derived(page.data.user);
</script>

<Popover.Root>
  <Popover.Trigger class="flex items-center gap-2.5">
    <CircleUser class="size-6" />
    <span class="text-xs"
      ><strong>{user?.user_metadata.role}</strong>
      {user?.user_metadata.lastname}</span
    >
  </Popover.Trigger>
  <Popover.Content>
    <sectrion class="absolute right-3 top-2">
      <Badge>{user?.user_metadata.role.toUpperCase()}</Badge>
    </sectrion>
    <section class="flex items-center gap-2.5">
      <CircleUser class="size-20" />
      <div>
        <div class="flex flex-col">
          <span class="text-sm"
            >{user?.user_metadata.lastname}, {user?.user_metadata.firstname}
            {user?.user_metadata.middlename}</span
          >
          <span class="text-sm text-muted-foreground">{user?.email}</span>
        </div>
      </div>
    </section>

    <section class="flex justify-end">
      <Button
        onclick={handleLogout}
        disabled={loader}
        size="sm"
        variant="destructive"
        class="relative"
      >
        {#if loader}
          <section
            class="absolute inset-0 flex items-center justify-center rounded-lg bg-destructive"
          >
            <LoaderCircle class="h-[20px] w-[20px] animate-spin" />
          </section>
        {/if}
        <LogOut class="size-2" />
        Logout
      </Button>
    </section>
  </Popover.Content>
</Popover.Root>
