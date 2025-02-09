<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import Printer from 'lucide-svelte/icons/printer';
  import { tick, type Snippet } from 'svelte';
  import type { ClassNameValue } from 'tailwind-merge';

  interface Props {
    children: Snippet;
    span?: Snippet<[{ title: string; class: ClassNameValue }]>;
    open: boolean;
  }

  let { open = $bindable(), children }: Props = $props();

  let isPrinting = $state(false);

  const handlePrint = async () => {
    isPrinting = true;

    await tick();

    const afterPrinting = () => {
      isPrinting = false;
      removeEventListener('afterprint', afterPrinting); //crazy closure
    };

    addEventListener('afterprint', afterPrinting);

    print();
  };
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="max-w-screen flex h-screen flex-col gap-10 overflow-auto">
    {#if !isPrinting}
      <Button class="max-w-fit" onclick={handlePrint}>Print Now <Printer /></Button>
    {/if}
    <section class="flex flex-col gap-4">
      <div class="flex items-center justify-between border-b-2 border-black py-5">
        <div class="flex items-start gap-4">
          <enhanced:img
            src="./assets/photo_1.png"
            alt=""
            class="size-32 rounded-full object-cover"
          />
          <div class="flex flex-col">
            <span class="text-base font-medium">Republic of the Philippines</span>
            <span class="text-xl font-semibold">ONE CAINTA COLLEGE</span>
            <span class="text-sm"
              >ROTC HUnters Road, Brgy. San Juan Cainta, Rizal Telephone No. 08-879-0410</span
            >
          </div>
        </div>

        <enhanced:img src="./assets/photo_2.png" alt="" class="w-[160px] object-contain" />
      </div>
    </section>

    <!--Dynamically render data in the template-->
    {@render children()}

    <section class="">
      <span>Prepared By: _____________________________________</span>
    </section>
  </Dialog.Content>
</Dialog.Root>
