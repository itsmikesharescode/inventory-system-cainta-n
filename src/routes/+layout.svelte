<script lang="ts">
  import '../app.css';
  import { invalidate } from '$app/navigation';
  import { Toaster } from '$lib/components/ui/sonner/index';

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
</script>

<Toaster />
<main class=" font-roboto">
  {@render children()}
</main>
