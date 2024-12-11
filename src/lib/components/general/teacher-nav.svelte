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
          href="/teacher"
          class="flex cursor-pointer select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-none transition-all hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
          >Reservations</a
        >

        <a
          href="/teacher/account"
          class="flex cursor-pointer select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-none transition-all hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
        >
          Account
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
          href="/teacher"
          class=" p-2 text-sm font-medium transition-all">Reservations</a
        >

        <a
          onclick={() => (showMobileMenu = false)}
          href="/teacher/account"
          class=" p-2 text-sm font-medium transition-all">Account</a
        >
      </section>

      <section class="absolute bottom-5">
        <Profile />
      </section>
    </Sheet.Content>
  </Sheet.Root>
{/if}
