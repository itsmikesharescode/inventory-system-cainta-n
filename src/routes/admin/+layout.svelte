<script lang="ts">
  import AppSideBar from '$lib/components/general/app-side-bar.svelte';
  import { Separator } from '$lib/components/ui/separator';
  import * as Sidebar from '$lib/components/ui/sidebar';
  import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
  import BreadCrump from '$lib/components/general/bread-crump/bread-crump.svelte';
  import { initBreadCrumpState } from '$lib/components/general/bread-crump/state.svelte';

  const { children } = $props();

  initBreadCrumpState();
</script>

<Sidebar.Provider>
  <AppSideBar />
  <Sidebar.Inset class="min-w-0">
    <header class="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
      <Sidebar.Trigger class="-ml-1" />
      <Separator orientation="vertical" class="mr-2 h-4" />
      <BreadCrump />
    </header>
    <div class="flex flex-1 gap-4 overflow-hidden p-4">
      <ScrollArea orientation="horizontal" class="h-full w-full">
        {@render children()}
      </ScrollArea>
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>
