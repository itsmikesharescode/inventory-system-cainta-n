<script lang="ts">
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';
  import { type UpdateEmailSchema, updateEmailSchema } from './schema';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';

  interface Props {
    updateEmailForm: SuperValidated<Infer<UpdateEmailSchema>>;
  }

  const { updateEmailForm }: Props = $props();

  const form = superForm(updateEmailForm, {
    validators: zodClient(updateEmailSchema),
    id: 'updateEmailForm',
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

<form method="POST" action="?/updateEmailEvent" use:enhance class="flex w-[290px] flex-col gap-2.5">
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
      <div class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary">
        <LoaderCircle class="h-[20px] w-[20px] animate-spin" />
      </div>
    {/if}

    Update Email
  </Form.Button>
</form>
