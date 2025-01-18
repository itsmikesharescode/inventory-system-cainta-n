<script lang="ts" module>
  // sample data
  const data = {
    versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
    navMain: [
      {
        title: 'Dashboard',
        url: '/admin',
        childLinks: null
      },
      {
        title: 'Transactions',
        url: null,
        childLinks: [
          {
            title: 'Reservations',
            url: '/admin/reservations'
          },
          {
            title: 'Borrowed Items',
            url: '/admin/borrowed-items'
          },
          {
            title: 'Returned Items',
            url: '/admin/returned-items'
          }
        ]
      },
      {
        title: 'Entries',
        url: null,
        childLinks: [
          {
            title: 'Departments',
            url: '/admin/departments'
          },
          {
            title: 'Rooms',
            url: '/admin/rooms'
          },
          {
            title: 'Categories',
            url: '/admin/categories'
          }
        ]
      },
      {
        title: 'Items',
        url: '/admin/items',
        childLinks: null
      },

      {
        title: 'Accounts',
        url: '/admin/accounts',
        childLinks: null
      }
    ]
  };

  const openViaVisited = $derived(() => {
    if (
      page.url.pathname === '/admin/reservations' ||
      page.url.pathname === '/admin/borrowed-items' ||
      page.url.pathname === '/admin/returned-items'
    ) {
      return 1;
    } else if (
      page.url.pathname === '/admin/departments' ||
      page.url.pathname === '/admin/rooms' ||
      page.url.pathname === '/admin/categories'
    ) {
      return 2;
    }
    return 0;
  });
</script>

<script lang="ts">
  import * as Collapsible from '$lib/components/ui/collapsible';
  import * as Sidebar from '$lib/components/ui/sidebar';
  import GalleryVerticalEnd from 'lucide-svelte/icons/gallery-vertical-end';
  import Minus from 'lucide-svelte/icons/minus';
  import Plus from 'lucide-svelte/icons/plus';
  import { page } from '$app/state';
  import type { ComponentProps } from 'svelte';

  let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root bind:ref {...restProps}>
  <Sidebar.Header>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.MenuButton size="lg">
          {#snippet child({ props })}
            <a href="##" {...props}>
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
              >
                <GalleryVerticalEnd class="size-4" />
              </div>
              <div class="flex flex-col gap-0.5 leading-none">
                <span class="font-semibold">Documentation</span>
                <span class="">v1.0.0</span>
              </div>
            </a>
          {/snippet}
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
    <!--Removed something here-->
  </Sidebar.Header>
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.Menu>
        {#each data.navMain as mainItem, index (mainItem.title)}
          <Collapsible.Root open={true} class="group/collapsible">
            <Sidebar.MenuItem>
              {#if mainItem.url}
                <a href={mainItem.url}>
                  <Sidebar.MenuButton
                    class={[
                      {
                        'bg-primary text-white': page.url.pathname === mainItem.url,
                        'transition-all duration-300 hover:bg-primary/50': true
                      }
                    ]}
                  >
                    {mainItem.title}
                  </Sidebar.MenuButton>
                </a>
              {:else}
                <Collapsible.Trigger>
                  {#snippet child({ props })}
                    <Sidebar.MenuButton {...props}>
                      {mainItem.title}{' '}
                      <Plus class="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <Minus class="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </Sidebar.MenuButton>
                  {/snippet}
                </Collapsible.Trigger>
                {#if mainItem.childLinks?.length}
                  <Collapsible.Content>
                    <Sidebar.MenuSub>
                      {#each mainItem.childLinks as item (item.title)}
                        <Sidebar.MenuSubItem>
                          <Sidebar.MenuSubButton
                            class={[
                              {
                                'bg-primary text-white': page.url.pathname === item.url,
                                'transition-all duration-300 hover:bg-primary/50': true
                              }
                            ]}
                          >
                            {#snippet child({ props })}
                              <a href={item.url} {...props}>{item.title}</a>
                            {/snippet}
                          </Sidebar.MenuSubButton>
                        </Sidebar.MenuSubItem>
                      {/each}
                    </Sidebar.MenuSub>
                  </Collapsible.Content>
                {/if}
              {/if}
            </Sidebar.MenuItem>
          </Collapsible.Root>
        {/each}
      </Sidebar.Menu>
    </Sidebar.Group>
  </Sidebar.Content>
  <Sidebar.Rail />
</Sidebar.Root>
