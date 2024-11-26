<script lang="ts">
  import { page } from '$app/stores';
  import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
  import Login from './components/login/login.svelte';
  import Register from './components/register/register.svelte';
  import ForgotPwd from './components/forgot-password/forgot-password.svelte';

  const { data } = $props();
</script>

<main class="grid min-h-screen gap-10 py-20 md:grid-cols-[1fr,400px] md:gap-0 md:p-0">
  <section class="border-r-2">
    <div class="flex flex-col items-center justify-center gap-5 md:mt-[20dvh]">
      <img src="/favicon.png" alt="logo" class="h-40 w-40" />
      <h1
        class="scroll-m-20 border-b pb-2 text-center font-semibold tracking-tight transition-colors first:mt-0 md:text-3xl"
      >
        ONE CAINTA COLLEGE
      </h1>

      <h1
        class="scroll-m-20 border-b pb-2 text-center font-semibold tracking-tight transition-colors first:mt-0 md:text-3xl"
      >
        BORROWING AND INVENTORY SYSTEM
      </h1>
    </div>
  </section>

  <ScrollArea class="md:max-h-screen">
    {#if $page.url.searchParams.get('forgot-password')}
      <ForgotPwd forgotPwdForm={data.forgotPwdForm} />
    {:else if $page.url.searchParams.get('register')}
      <Register registerForm={data.registerForm} />
    {:else}
      <Login loginForm={data.loginForm} />
    {/if}
  </ScrollArea>
</main>
