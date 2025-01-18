<script lang="ts">
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import { useBreadCrumpRunes } from './state.svelte';

  const breadRunes = useBreadCrumpRunes();
</script>

<Breadcrumb.Root>
  <Breadcrumb.List>
    <!-- <Breadcrumb.Item class="hidden md:block">
      <Breadcrumb.Link href="#">LINK</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator class="hidden md:block" />
    <Breadcrumb.Item>
      <Breadcrumb.Page>Active</Breadcrumb.Page>
    </Breadcrumb.Item> -->

    {#each breadRunes.getBread() as bread}
      {#if bread.childLinks}
        <Breadcrumb.Item class="hidden md:block">
          <Breadcrumb.Link href={bread.url}>{bread.name}</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator class="hidden md:block" />
        {#each bread.childLinks as child, index}
          {#if index === bread.childLinks.length - 1}
            <Breadcrumb.Item>
              <Breadcrumb.Page>{child.name}</Breadcrumb.Page>
            </Breadcrumb.Item>
          {:else}
            <Breadcrumb.Item class="hidden md:block">
              <Breadcrumb.Link href={child.url}>{child.name}</Breadcrumb.Link>
            </Breadcrumb.Item>
          {/if}
        {/each}
      {:else}
        <Breadcrumb.Item>
          <Breadcrumb.Page>{bread.name}</Breadcrumb.Page>
        </Breadcrumb.Item>
      {/if}
    {/each}
  </Breadcrumb.List>
</Breadcrumb.Root>
