<script lang="ts">
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import { X } from 'lucide-svelte';
  import { ScrollArea } from '$lib/components/ui/scroll-area/index';
  import type { AdminLayout } from '$lib/types/admin/adminLayout.types';
  interface Props {
    showViewReservation: boolean;
    reservation: AdminLayout['reservations'][number];
  }

  let { showViewReservation = $bindable(), ...props }: Props = $props();
</script>

<AlertDialog.Root bind:open={showViewReservation}>
  <AlertDialog.Content class="p-0">
    <ScrollArea class="max-h-screen md:max-h-[80dvh]">
      <button
        onclick={() => {
          showViewReservation = false;
          history.back();
        }}
        class="absolute right-4 top-4 z-30 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
      >
        <X class="h-4 w-4" />
        <span class="sr-only">Close</span>
      </button>
      <AlertDialog.Header class="sticky top-0 rounded-t-lg p-5 backdrop-blur-lg">
        <AlertDialog.Title>View Reservation</AlertDialog.Title>
      </AlertDialog.Header>

      <div class="flex flex-col gap-2.5 p-5 pt-0">
        <div class="">
          <p class="">Status</p>
          <p class="text-muted-foreground">{props.reservation.status}</p>
        </div>

        <div class="">
          <p class="">Reference ID</p>
          <p class="text-muted-foreground">{props.reservation.reference_id}</p>
        </div>

        <div class="">
          <p class="">Teacher ID</p>
          <p class="text-muted-foreground">{props.reservation.teacher_real_id}</p>
        </div>

        <div class="">
          <p class="">Teacher Name</p>
          <p class="text-muted-foreground">{props.reservation.teacher_name}</p>
        </div>

        <div class="">
          <p class="">Max Item</p>
          <p class="text-muted-foreground">{props.reservation.max_items}</p>
        </div>

        <div class="">
          <p class="">Reservation Date</p>
          <p class="text-muted-foreground">{props.reservation.time_limit}</p>
        </div>

        <div class="">
          <p class="">Room</p>
          <p class="text-muted-foreground">{props.reservation.room}</p>
        </div>
      </div>
    </ScrollArea>
  </AlertDialog.Content>
</AlertDialog.Root>
