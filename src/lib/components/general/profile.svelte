<script lang="ts">
  import * as Popover from '$lib/components/ui/popover';
  import CircleUser from 'lucide-svelte/icons/circle-user';
  import { buttonVariants } from '$lib/components/ui/button';
  import { cn } from '$lib/utils';
</script>

<Popover.Root>
  <Popover.Trigger class="flex items-center gap-2.5">
    <CircleUser class="size-6" />
    <span class="text-xs"><strong>Admin</strong> Charles Ostria</span>
  </Popover.Trigger>
  <Popover.Content>Place content for the popover here.</Popover.Content>
</Popover.Root>
