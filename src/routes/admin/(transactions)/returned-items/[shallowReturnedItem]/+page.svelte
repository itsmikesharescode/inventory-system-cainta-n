<script lang="ts">
  import RenderReturnedItems from '../_components/RenderReturnedItems.svelte';

  const { data } = $props();

  const returnedItemRef = $derived(data.specificReturnedItem.data);
</script>

{#if returnedItemRef}
  <div class="flex max-w-lg flex-col gap-2.5 p-5 pt-0">
    <p class="text-lg font-semibold">View Returnee Item</p>

    <div class="flex flex-col gap-2.5 p-5 pt-0">
      <div class="flex flex-col gap-1.5">
        <span class="">Teacher ID</span>
        <span class="text-muted-foreground">{returnedItemRef.teacher_real_id}</span>
      </div>

      <div class="flex flex-col gap-1.5">
        <span class="">Reference ID</span>
        <span class="text-muted-foreground">{returnedItemRef.reference_id}</span>
      </div>

      <div class="flex flex-col gap-1.5">
        <span class="">Borrower Name</span>
        <span class="text-muted-foreground">{returnedItemRef.borrower_name}</span>
      </div>

      <div class="flex flex-col gap-1.5">
        <span class="">Returned Items</span>
        <div class="">
          <RenderReturnedItems returnee={returnedItemRef} />
        </div>
      </div>

      <div class="flex flex-col gap-1.5">
        <span class="">Borrowed Date</span>
        <span class="text-muted-foreground">{returnedItemRef.borrowed_date}</span>
      </div>

      <div class="flex flex-col gap-1.5">
        <span class=""> Returned Date</span>
        <span class="text-muted-foreground">{returnedItemRef.returned_date}</span>
      </div>
    </div>
  </div>
{/if}
