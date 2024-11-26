<script lang="ts">
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import { X } from 'lucide-svelte';
  import { ScrollArea } from '$lib/components/ui/scroll-area/index';
  import type { AdminLayout } from '$lib/types/admin/adminLayout.types';
  interface Props {
    teacher: AdminLayout['teachers'][number];
    showViewTeacher: boolean;
  }

  let { showViewTeacher = $bindable(), teacher }: Props = $props();
</script>

<AlertDialog.Root bind:open={showViewTeacher}>
  <AlertDialog.Content class="p-0">
    <ScrollArea class="max-h-screen md:max-h-[80dvh]">
      <button
        onclick={() => {
          showViewTeacher = false;
          history.back();
        }}
        class="absolute right-4 top-4 z-30 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
      >
        <X class="h-4 w-4" />
        <span class="sr-only">Close</span>
      </button>
      <AlertDialog.Header class="sticky top-0 rounded-t-lg p-5 backdrop-blur-lg">
        <AlertDialog.Title>View Teacher</AlertDialog.Title>
      </AlertDialog.Header>

      <div class="flex flex-col gap-2.5 p-5 pt-0">
        <div class="">
          <p class="">Teacher ID</p>
          <p class="text-muted-foreground">{teacher.user_meta_data.teacher_real_id}</p>
        </div>

        <div class="">
          <p class="">Full name</p>
          <p class="text-muted-foreground">
            {teacher.user_meta_data.lastname}, {teacher.user_meta_data.firstname}
            {teacher.user_meta_data.middlename}
          </p>
        </div>

        <div class="">
          <p class="">Department</p>
          <p class="text-muted-foreground">{teacher.user_meta_data.department}</p>
        </div>

        <div class="">
          <p class="">Email</p>
          <p class="text-muted-foreground">{teacher.user_meta_data.email}</p>
        </div>

        <div class="">
          <p class="">Phone</p>
          <p class="text-muted-foreground">{teacher.user_meta_data.phonenumber}</p>
        </div>
      </div>
    </ScrollArea>
  </AlertDialog.Content>
</AlertDialog.Root>
