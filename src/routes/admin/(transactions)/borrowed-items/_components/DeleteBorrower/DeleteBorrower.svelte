<script lang="ts">
  import { enhance } from '$app/forms';
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import Button from '$lib/components/ui/button/button.svelte';
  import type { AdminLayout } from '$lib/types/admin/adminLayout.types';
  import type { Result } from '$lib/types/types';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { LoaderCircle } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';

  interface Props {
    showDeleteBorrower: boolean;
    borrower: AdminLayout['borrowed_items'][number];
  }

  let { showDeleteBorrower = $bindable(), borrower }: Props = $props();

  let deleteLoader = $state(false);
  const deleteBorrowerEvent: SubmitFunction = () => {
    deleteLoader = true;
    return async ({ result, update }) => {
      const { status, data } = result as Result<{ msg: string }>;

      switch (status) {
        case 200:
          toast.success('', { description: data.msg });
          showDeleteBorrower = false;
          break;

        case 401:
          toast.error('', { description: data.msg });
          break;
      }
      await update();
      deleteLoader = false;
    };
  };
</script>

<AlertDialog.Root bind:open={showDeleteBorrower}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Delete this borrowed item?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete the borrowed item in our
        database.
      </AlertDialog.Description>
    </AlertDialog.Header>

    <AlertDialog.Footer>
      <AlertDialog.Cancel disabled={deleteLoader}>Cancel</AlertDialog.Cancel>
      <form method="post" action="?/deleteBorrowerEvent" use:enhance={deleteBorrowerEvent}>
        <input name="id" type="hidden" value={borrower.id} />
        <Button type="submit" disabled={deleteLoader} class="relative w-full" variant="destructive">
          {#if deleteLoader}
            <div
              class="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center gap-1.5 rounded-lg bg-destructive"
            >
              <LoaderCircle class="h-[20px] w-[20px] animate-spin" />
            </div>
          {/if}

          Delete
        </Button>
      </form>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
