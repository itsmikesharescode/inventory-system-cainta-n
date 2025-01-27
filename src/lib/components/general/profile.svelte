<script lang="ts">
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import * as Sidebar from '$lib/components/ui/sidebar';
  import { useSidebar } from '$lib/components/ui/sidebar';
  import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
  import LogOut from 'lucide-svelte/icons/log-out';
  import { page } from '$app/state';
  import CircleUserRound from 'lucide-svelte/icons/circle-user-round';
  import { invalidateAll } from '$app/navigation';

  interface Props {
    isTeacher?: boolean;
  }

  const { isTeacher = false }: Props = $props();

  const sidebar = useSidebar();

  const user = page.data.user;

  const handleLogout = async () => {
    if (!page.data.supabase) return;

    await page.data.supabase.auth.signOut();

    invalidateAll();
  };
</script>

{#if user}
  {#if isTeacher}
    <DropdownMenu.Root>
      <DropdownMenu.Trigger class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
        <div class="size-10">
          <CircleUserRound class="size-10" />
        </div>
        <div class="grid flex-1 text-left text-sm leading-tight">
          <span class="truncate font-semibold">{user.user_metadata.firstname}</span>
          <span class="truncate text-xs">{user.email}</span>
        </div>
        <ChevronsUpDown class="ml-auto size-4" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        class="w-[--bits-dropdown-menu-anchor-width] min-w-56 rounded-lg"
        align="end"
        sideOffset={4}
      >
        <DropdownMenu.Label class="p-0 font-normal">
          <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <CircleUserRound class="size-10" />
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">{user.user_metadata.firstname}</span>
              <span class="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenu.Label>
        <DropdownMenu.Separator />

        <DropdownMenu.Item onclick={handleLogout}>
          <LogOut />
          Log out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  {:else}
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            {#snippet child({ props })}
              <Sidebar.MenuButton
                size="lg"
                class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                {...props}
              >
                <div class="size-10">
                  <CircleUserRound class="size-10" />
                </div>
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-semibold">{user.user_metadata.firstname}</span>
                  <span class="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown class="ml-auto size-4" />
              </Sidebar.MenuButton>
            {/snippet}
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            class="w-[--bits-dropdown-menu-anchor-width] min-w-56 rounded-lg"
            side={sidebar.isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenu.Label class="p-0 font-normal">
              <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <CircleUserRound class="size-10" />
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-semibold">{user.user_metadata.firstname}</span>
                  <span class="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenu.Label>
            <DropdownMenu.Separator />

            <DropdownMenu.Item onclick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  {/if}
{/if}
