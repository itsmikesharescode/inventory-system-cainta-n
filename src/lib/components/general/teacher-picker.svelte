<script lang="ts">
  import Check from 'lucide-svelte/icons/check';
  import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
  import { tick } from 'svelte';
  import * as Command from '$lib/components/ui/command/index.js';
  import * as Popover from '$lib/components/ui/popover/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { cn } from '$lib/utils.js';
  import { page } from '$app/stores';
  import streamTeachers from '$lib/db-calls/streamTeachers';
  import type { Database } from '$lib/database.types';

  interface Props {
    user_id: string;
  }

  let { user_id = $bindable() }: Props = $props();

  let teachers = $state<Database['public']['Tables']['teachers_tb']['Row'][] | null>(null);

  const getTeachers = async () => {
    if (!$page.data.supabase) return;
    teachers = await streamTeachers($page.data.supabase);
  };

  let open = $state(false);
  let triggerRef = $state<HTMLButtonElement>(null!);

  const selectedValue = $derived(teachers?.find((f) => f.user_id === user_id)?.user_meta_data);

  function closeAndFocusTrigger() {
    open = false;
    tick().then(() => {
      triggerRef.focus();
    });
  }

  $effect(() => {
    getTeachers();

    return () => {
      teachers = null;
    };
  });

  const checkSelected = () => {
    if (selectedValue) {
      return `${selectedValue?.lastname}, ${selectedValue?.firstname} ${selectedValue?.middlename}`;
    }
    return 'Select a teacher';
  };
</script>

<Popover.Root bind:open>
  <Popover.Trigger bind:ref={triggerRef}>
    {#snippet child({ props })}
      <Button
        variant="outline"
        class="w-full justify-between {user_id ? '' : 'text-muted-foreground'}"
        {...props}
        role="combobox"
        aria-expanded={open}
      >
        {checkSelected()}
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-[300px] p-0">
    <Command.Root>
      <Command.Input placeholder="Search teacher fullname..." />
      <Command.List>
        <Command.Empty>No teachers found.</Command.Empty>
        <Command.Group>
          {#each teachers ?? [] as teacher}
            <Command.Item
              value={`${teacher.user_meta_data.lastname}, ${teacher.user_meta_data.firstname} ${teacher.user_meta_data.middlename}`}
              onSelect={() => {
                user_id = teacher.user_id;
                closeAndFocusTrigger();
              }}
            >
              <Check class={cn('mr-2 size-4', user_id !== teacher.user_id && 'text-transparent')} />
              <section class="flex flex-col">
                <span>
                  {`${teacher.user_meta_data.lastname}, ${teacher.user_meta_data.firstname} ${teacher.user_meta_data.middlename}`}
                </span>
                <span class="text-xs text-muted-foreground">
                  {teacher.user_meta_data.teacher_id}
                </span>
              </section>
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
