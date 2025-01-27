<script lang="ts">
  import '../app.css';
  import { invalidate } from '$app/navigation';
  import { Toaster } from '$lib/components/ui/sonner/index';
  import { onNavigate } from '$app/navigation';

  let { children, data } = $props();

  const { session, supabase } = $derived(data);

  $effect(() => {
    const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth');
      }
    });

    return () => data.subscription.unsubscribe();
  });

  onNavigate((navigation) => {
    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

<svelte:boundary onerror={(e) => console.error(e)}>
  <Toaster />
  <main class="font-roboto overflow-hidden">
    {@render children()}
  </main>

  {#snippet failed(error, reset)}
    <p>Oops! try to reload</p>
    <button onclick={reset}>Relog Page</button>
  {/snippet}
</svelte:boundary>
