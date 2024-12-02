<script lang="ts">
  import * as Card from '$lib/components/ui/card/index.js';

  interface Props {
    title: string;
    count: number;
  }

  const { title, count }: Props = $props();
</script>

<Card.Root>
  <Card.Header>
    <Card.Title class="text-3xl">{title}</Card.Title>
  </Card.Header>
  <Card.Content>
    <span class="text-4xl font-bold">{count}</span>
  </Card.Content>
</Card.Root>
