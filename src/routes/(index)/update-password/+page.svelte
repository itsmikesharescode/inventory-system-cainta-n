<script lang="ts">
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';
  import { updatePasswordSchema } from './schema';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { goto } from '$app/navigation';

  const { data } = $props();

  const form = superForm(data.updatePasswordForm, {
    validators: zodClient(updatePasswordSchema),
    id: 'updatePasswordForm',
    async onUpdate({ result }) {
      const { status, data } = result;
      switch (status) {
        case 200:
          toast.success(data.msg);
          await goto('/');
          break;

        case 401:
          toast.error(data.msg);
          break;
      }
    }
  });

  const { form: formData, enhance, submitting } = form;
</script>

<div class="flex h-full min-h-screen flex-col items-center justify-center gap-2.5">
  <h1 class="scroll-m-20 text-2xl font-semibold tracking-tight">Update Password</h1>

  <form
    method="POST"
    action="?/updatePasswordEvent"
    use:enhance
    class="flex w-[290px] flex-col gap-2.5"
  >
    <Form.Field {form} name="password">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>New Password</Form.Label>
          <Input
            type="password"
            {...props}
            bind:value={$formData.password}
            placeholder="Enter new password"
          />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="confirmPassword">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Confirm New Password</Form.Label>
          <Input
            type="password"
            {...props}
            bind:value={$formData.confirmPassword}
            placeholder="Confirm new password"
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

      Update Password
    </Form.Button>
  </form>
</div>
