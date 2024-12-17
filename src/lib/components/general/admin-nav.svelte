<script lang="ts">
  import * as Menubar from '$lib/components/ui/menubar/index.js';
  import ChevronDown from 'lucide-svelte/icons/chevron-down';
  import Menu from 'lucide-svelte/icons/menu';
  import * as Sheet from '$lib/components/ui/sheet/index.js';
  import * as Accordion from '$lib/components/ui/accordion/index.js';
  import { MediaQuery } from 'runed';
  import Profile from './profile.svelte';

  const screen = new MediaQuery('(min-width: 768px)');

  let showMobileMenu = $state(false);
</script>

{#if screen.matches}
  <Menubar.Root class="rounded-none border-none bg-white">
    <section class="container flex items-center justify-between gap-2.5 rounded-none border-none">
      <div class="flex items-center gap-2.5">
        <a
          href="/admin"
          class="flex cursor-pointer select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-none transition-all hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
          >Dashboard</a
        >
        <Menubar.Menu>
          <Menubar.Trigger class="cursor-pointer gap-1.5 transition-all hover:bg-accent">
            Transactions <ChevronDown class="size-4" />
          </Menubar.Trigger>
          <Menubar.Content class="bg-white">
            <a href="/admin/reservations">
              <Menubar.Item class="font-roboto cursor-pointer text-sm font-medium">
                Reservations
              </Menubar.Item>
            </a>
            <a href="/admin/borrowed-items">
              <Menubar.Item class="font-roboto cursor-pointer text-sm font-medium">
                Borrowed Items
              </Menubar.Item>
            </a>
            <a href="/admin/returned-items">
              <Menubar.Item class="font-roboto cursor-pointer text-sm font-medium">
                Returned Items
              </Menubar.Item>
            </a>
          </Menubar.Content>
        </Menubar.Menu>

        <Menubar.Menu>
          <Menubar.Trigger class="cursor-pointer gap-1.5 transition-all hover:bg-accent">
            Entries <ChevronDown class="size-4" />
          </Menubar.Trigger>
          <Menubar.Content class="bg-white">
            <a href="/admin/departments">
              <Menubar.Item class="font-roboto cursor-pointer text-sm font-medium">
                Departments
              </Menubar.Item>
            </a>
            <a href="/admin/rooms">
              <Menubar.Item class="font-roboto cursor-pointer text-sm font-medium">
                Rooms
              </Menubar.Item>
            </a>
          </Menubar.Content>
        </Menubar.Menu>

        <a
          href="/admin/items"
          class="flex cursor-pointer select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-none transition-all hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
        >
          Items
        </a>

        <a
          href="/admin/accounts"
          class="flex cursor-pointer select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-none transition-all hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
        >
          Accounts
        </a>
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
