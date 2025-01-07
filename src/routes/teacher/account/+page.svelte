<script lang="ts">
  import UpdateEmail from './components/update-email/update-email.svelte';
  import UpdateInformation from './components/update-information/update-information.svelte';
  import UpdatePassword from './components/update-password/update-password.svelte';
  import { fly } from 'svelte/transition';
  const { data } = $props();
</script>

<main
  class="container flex min-h-screen flex-col items-center justify-center gap-10"
  in:fly={{ x: 1000, duration: 300, delay: 100 }}
>
  <span class="text-4xl font-semibold">Account Settings</span>
  <section class="grid gap-5 md:grid-cols-2">
    <div class="flex flex-col gap-5">
      <UpdateEmail updateEmailForm={data.updateEmailForm} />
      <UpdateInformation updateInformationForm={data.updateInformationForm} />
    </div>
    <UpdatePassword updatePasswordForm={data.updatePasswordForm} />
  </section>
</main>
