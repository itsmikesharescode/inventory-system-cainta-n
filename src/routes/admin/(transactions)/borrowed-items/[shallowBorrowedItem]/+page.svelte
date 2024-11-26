<script lang="ts">
  import RenderBorrowedItems from '../_components/RenderBorrowedItems.svelte';

  const { data } = $props();

  const borrowedItemRef = $derived(data.specificBorrowedItem.data);
</script>

{#if borrowedItemRef}
  <div class="flex max-w-lg flex-col gap-2.5 p-5 pt-0">
    <p class="text-lg font-semibold">View Borrowed Item</p>

    <div class="flex flex-col gap-1.5">
      <span class="">Teacher ID</span>
      <span class="text-muted-foreground">{borrowedItemRef.teacher_real_id}</span>
    </div>

    <div class="flex flex-col gap-1.5">
      <span class="">Reference ID</span>
      <span class="text-muted-foreground">{borrowedItemRef.reference_id}</span>
    </div>

    <div class="flex flex-col gap-1.5">
      <span class="">Borrowed Date</span>
      <span class="text-muted-foreground">{borrowedItemRef.borrowed_date}</span>
    </div>

    <div class="flex flex-col gap-1.5">
      <span class="">Items Borrowed</span>
      <div class="">
        <RenderBorrowedItems borrower={borrowedItemRef} />
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <span class="">Room</span>
      <span class="text-muted-foreground">{borrowedItemRef.room}</span>
    </div>
  </div>
{/if}
