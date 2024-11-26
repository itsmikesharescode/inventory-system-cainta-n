<script lang="ts">
  const { data } = $props();

  const reservationRef = $derived(data.specificReservation.data);
</script>

{#if reservationRef}
  <div class="flex max-w-lg flex-col gap-2.5 p-5 pt-0">
    <p class="text-lg font-semibold">View Item</p>
    <div class="flex flex-col gap-2.5 p-5 pt-0">
      <div class="">
        <p class="">Status</p>
        <p class="text-muted-foreground">{reservationRef.status}</p>
      </div>

      <div class="">
        <p class="">Reference ID</p>
        <p class="text-muted-foreground">{reservationRef.reference_id}</p>
      </div>

      <div class="">
        <p class="">Teacher ID</p>
        <p class="text-muted-foreground">{reservationRef.teacher_real_id}</p>
      </div>

      <div class="">
        <p class="">Teacher Name</p>
        <p class="text-muted-foreground">{reservationRef.teacher_name}</p>
      </div>

      <div class="">
        <p class="">Max Item</p>
        <p class="text-muted-foreground">{reservationRef.max_items}</p>
      </div>

      <div class="">
        <p class="">Reservation Date</p>
        <p class="text-muted-foreground">{reservationRef.time_limit}</p>
      </div>

      <div class="">
        <p class="">Room</p>
        <p class="text-muted-foreground">{reservationRef.room}</p>
      </div>
    </div>
  </div>
{/if}
