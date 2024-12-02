<script lang="ts">
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';
  import { type LoginSchema, loginSchema } from './schema';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';

  interface Props {
    loginForm: SuperValidated<Infer<LoginSchema>>;
  }

  const { loginForm }: Props = $props();

  const form = superForm(loginForm, {
    validators: zodClient(loginSchema),
    id: 'loginForm',
    async onUpdate({ result }) {
      const { status, data } = result;
      switch (status) {
        case 200:
          toast.success('', { description: data.msg });
          break;

        case 401:
          toast.error('', { description: data.msg });
          break;
      }
    }
  });

  const { form: formData, enhance, submitting } = form;
</script>

<div class="flex h-full flex-col items-center justify-center gap-2.5">
  <h1 class="scroll-m-20 text-2xl font-semibold tracking-tight">Log in</h1>

  <form method="POST" action="?/loginEvent" use:enhance class="flex w-[290px] flex-col gap-2.5">
    <Form.Field {form} name="email">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Email</Form.Label>
          <Input {...props} bind:value={$formData.email} placeholder="Enter email" />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="password">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Password</Form.Label>
          <Input
            type="password"
            {...props}
            bind:value={$formData.password}
            placeholder="Enter password"
          />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Button disabled={$submitting} class="relative">
      {#if $submitting}
        <div class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary">
          <LoaderCircle class="h-[20px] w-[20px] animate-spin" />
        </div>
      {/if}

      Log in
    </Form.Button>
  </form>
  <a href="?forgot-password=true" class="mt-10 text-sm underline transition-all hover:text-primary">
    Forgot Password
  </a>
  <span class="text-sm">Don't have an account yet?</span>
  <a href="?register=true" class="text-sm underline transition-all hover:text-primary"
    >Create here</a
  >
</div>
