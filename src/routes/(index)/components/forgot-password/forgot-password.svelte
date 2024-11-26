<script lang="ts">
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { forgotPwdSchema } from './schema';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';
  import type { ForgotPwdSchema } from './schema';

  interface Props {
    forgotPwdForm: SuperValidated<Infer<ForgotPwdSchema>>;
  }

  const { forgotPwdForm }: Props = $props();

  const form = superForm(forgotPwdForm, {
    validators: zodClient(forgotPwdSchema),
    id: 'forgot-pwd-form',
    async onUpdate({ result }) {
      const { status, data } = result;
      switch (status) {
        case 200:
          toast.success(data.msg);
          break;

        case 401:
          toast.error(data.msg);
          break;
      }
    }
  });

  const { form: formData, enhance, submitting } = form;
</script>

<div class="flex h-full flex-col items-center justify-center gap-2.5">
  <h1 class="scroll-m-20 text-2xl font-semibold tracking-tight">Forgot Password</h1>

  <form method="POST" action="?/forgotPwdEvent" use:enhance class="flex w-[290px] flex-col gap-2.5">
    <Form.Field {form} name="email">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Email</Form.Label>
          <Input {...props} bind:value={$formData.email} placeholder="Enter email" />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Button disabled={$submitting} class="relative">
      {#if $submitting}
        <div
          class="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center gap-1.5 rounded-lg bg-primary"
        >
          <span>Sending</span>
          <LoaderCircle class="h-[20px] w-[20px] animate-spin" />
        </div>
      {/if}

      Send Reset Link
    </Form.Button>
  </form>

  <p class=" mt-10 text-sm">Already recovered your account?</p>
  <a href="/" class="text-sm underline transition-all hover:text-primary">Log in here</a>
</div>
