<script lang="ts">
  const { data } = $props();
</script>

<div class="flex max-w-lg flex-col gap-2.5 p-5 pt-0">
  <p class="text-lg font-semibold">View Item</p>
  <div class="">
    <p class="">Device ID</p>
    <p class="text-muted-foreground">{data.specificItem.data?.device_id}</p>
  </div>

  <div class="">
    <p class="">Model</p>
    <p class="text-muted-foreground">{data.specificItem.data?.model}</p>
  </div>

  <div class="">
    <p class="">Category</p>
    <p class="text-muted-foreground">{data.specificItem.data?.category}</p>
  </div>

  <div class="">
    <p class="">Type</p>
    <p class="text-muted-foreground">{data.specificItem.data?.type}</p>
  </div>

  <div class="">
    <p class="">Status</p>
    <p class="text-muted-foreground">{data.specificItem.data?.status}</p>
  </div>

  <div class="">
    <p class="">Brand</p>
    <p class="text-muted-foreground">{data.specificItem.data?.brand}</p>
  </div>

  <div class="">
    <p class="">MR</p>
    <p class="text-muted-foreground">{data.specificItem.data?.mr}</p>
  </div>

  <div class="">
    <p class="">Price</p>
    <p class="text-muted-foreground">{data.specificItem.data?.price}</p>
  </div>

  <div class="">
    <p class="">Quantity</p>
    <p class="text-muted-foreground">{data.specificItem.data?.quantity}</p>
  </div>

  <div class="">
    <p class="">Description</p>
    <p class="text-muted-foreground">{data.specificItem.data?.description}</p>
  </div>
</div>
