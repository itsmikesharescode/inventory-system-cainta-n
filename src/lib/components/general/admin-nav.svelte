<script lang="ts">
  import * as Menubar from '$lib/components/ui/menubar/index.js';
  import Menu from 'lucide-svelte/icons/menu';
  import * as Sheet from '$lib/components/ui/sheet/index.js';
  import * as Accordion from '$lib/components/ui/accordion/index.js';
  import { MediaQuery } from 'runed';
  import Profile from './profile.svelte';
  import { NavigationMenu } from 'bits-ui';
  import ChevronDown from 'lucide-svelte/icons/chevron-down';
  import { cn } from '$lib/utils';

  const components: { title: string; href: string; description: string }[] = [
    {
      title: 'Alert Dialog',
      href: '/docs/components/alert-dialog',
      description:
        'A modal dialog that interrupts the user with important content and expects a response.'
    },
    {
      title: 'Link Preview',
      href: '/docs/components/link-preview',
      description: 'For sighted users to preview content available behind a link.'
    },
    {
      title: 'Progress',
      href: '/docs/components/progress',
      description:
        'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.'
    },
    {
      title: 'Scroll-area',
      href: '/docs/components/scroll-area',
      description: 'Visually or semantically separates content.'
    },
    {
      title: 'Tabs',
      href: '/docs/components/tabs',
      description:
        'A set of layered sections of content—known as tab panels—that are displayed one at a time.'
    },
    {
      title: 'Tooltip',
      href: '/docs/components/tooltip',
      description:
        'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.'
    }
  ];

  type ListItemProps = {
    className?: string;
    title: string;
    href: string;
    content: string;
  };

  const screen = new MediaQuery('(min-width: 768px)');

  let showMobileMenu = $state(false);
</script>

{#if screen.matches}
  <Menubar.Root class="rounded-none border-none bg-white">
    <section class="container flex items-center justify-between gap-2.5 rounded-none border-none">
      <div class="flex items-center gap-2.5">
        {#snippet ListItem({ className, title, content, href }: ListItemProps)}
          <li>
            <NavigationMenu.Link
              class={cn(
                'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground',
                className
              )}
              {href}
            >
              <div class="text-sm font-medium leading-none">{title}</div>
              <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                {content}
              </p>
            </NavigationMenu.Link>
          </li>
        {/snippet}

        <NavigationMenu.Root
          class="relative z-10 flex max-w-max flex-1 items-center justify-center"
        >
          <NavigationMenu.List
            class="group flex flex-1 list-none items-center justify-center space-x-1"
          >
            <!-- Dashboard -->
            <NavigationMenu.Item>
              <NavigationMenu.Link
                class="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-muted/50 data-[state=open]:bg-muted/50"
                href="/admin/"
              >
                Dashboard
              </NavigationMenu.Link>
            </NavigationMenu.Item>
            <!--Transactions-->
            <NavigationMenu.Item>
              <NavigationMenu.Trigger
                class="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-muted/50 data-[state=open]:bg-muted/50"
              >
                Transactions
                <ChevronDown
                  class="relative top-[1px] ml-1 size-3 transition duration-200 group-data-[state=open]:rotate-180"
                  aria-hidden="true"
                />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content
                class="left-0 top-0 z-50 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto"
              >
                <ul class="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  {@render ListItem({
                    href: '/admin/reservations',
                    title: 'Reservations',
                    content: 'Manage reservations'
                  })}
                  {@render ListItem({
                    href: '/admin/borrowed-items',
                    title: 'Borrowed Items',
                    content: 'Manage borrowed items'
                  })}
                  {@render ListItem({
                    href: '/admin/returned-items',
                    title: 'Returned Items',
                    content: 'Manage returned items'
                  })}
                </ul>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            <!--Entries-->
            <NavigationMenu.Item>
              <NavigationMenu.Trigger
                class="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-muted/50 data-[state=open]:bg-muted/50"
              >
                Entries
                <ChevronDown
                  class="relative top-[1px] ml-1 size-3 transition duration-200 group-data-[state=open]:rotate-180"
                  aria-hidden="true"
                />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content
                class="left-0 top-0 z-50 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto"
              >
                <ul class="grid w-[400px] gap-3 p-6 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {@render ListItem({
                    href: '/admin/departments',
                    title: 'Departments',
                    content: 'Manage departments'
                  })}
                  {@render ListItem({
                    href: '/admin/rooms',
                    title: 'Rooms',
                    content: 'Manage rooms'
                  })}
                </ul>
              </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Link
                class="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-muted/50 data-[state=open]:bg-muted/50"
                href="/admin/items"
              >
                Items
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Link
                class="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-muted/50 data-[state=open]:bg-muted/50"
                href="/admin/accounts"
              >
                Accounts
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            <NavigationMenu.Indicator
              class="top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in"
            >
              <div
                class="relative top-[60%] size-2 rotate-45 rounded-tl-sm bg-border shadow-md"
              ></div>
            </NavigationMenu.Indicator>
          </NavigationMenu.List>
          <div class="absolute left-0 top-full flex justify-center">
            <NavigationMenu.Viewport
              class="origin-top-center relative mt-1.5 h-[var(--bits-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-background text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--bits-navigation-menu-viewport-width)]"
            />
          </div>
        </NavigationMenu.Root>
      </div>

      <Profile />
    </section>
  </Menubar.Root>
{:else}
  <nav class="container flex items-center justify-end border-b-[1px] p-2 px-4">
    <button onclick={() => (showMobileMenu = true)}>
      <Menu class="size-4" />
    </button>
  </nav>
  <Sheet.Root bind:open={showMobileMenu}>
    <Sheet.Content side="left" class="font-roboto pt-10">
      <section class="flex flex-col gap-2">
        <a
          onclick={() => (showMobileMenu = false)}
          href="/admin"
          class=" p-2 text-sm font-medium transition-all">Dashboard</a
        >
        <Accordion.Root type="single" class="">
          <Accordion.Item value="transactions" class="border-none">
            <Accordion.Trigger class="p-2">Transactions</Accordion.Trigger>
            <Accordion.Content class="border-l-2 px-2 pt-2 ">
              <section class="flex flex-col gap-2">
                <a
                  onclick={() => (showMobileMenu = false)}
                  href="/admin/reservations"
                  class="font-medium">Reservations</a
                >
                <a
                  onclick={() => (showMobileMenu = false)}
                  href="/admin/borrowed-items"
                  class="font-medium">Borrowed Items</a
                >
                <a
                  onclick={() => (showMobileMenu = false)}
                  href="/admin/returned-items"
                  class="font-medium">Returned Items</a
                >
              </section>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>

        <Accordion.Root type="single" class="">
          <Accordion.Item value="transactions" class="border-none">
            <Accordion.Trigger class="p-2">Entries</Accordion.Trigger>
            <Accordion.Content class="border-l-2 px-2 pt-2 ">
              <section class="flex flex-col gap-2">
                <a
                  onclick={() => (showMobileMenu = false)}
                  href="/admin/departments"
                  class="font-medium">Departments</a
                >
                <a onclick={() => (showMobileMenu = false)} href="/admin/rooms" class="font-medium"
                  >Rooms</a
                >
              </section>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
        <a
          onclick={() => (showMobileMenu = false)}
          href="/admin/items"
          class=" p-2 text-sm font-medium transition-all">Items</a
        >
        <a
          onclick={() => (showMobileMenu = false)}
          href="/admin/accounts"
          class=" p-2 text-sm font-medium transition-all">Accounts</a
        >
      </section>

      <section class="absolute bottom-5">
        <Profile />
      </section>
    </Sheet.Content>
  </Sheet.Root>
{/if}
