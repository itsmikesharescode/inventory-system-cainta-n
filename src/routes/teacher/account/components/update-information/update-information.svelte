<script lang="ts">
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';
  import { type UpdateInformationSchema, updateInformationSchema } from './schema';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { page } from '$app/stores';

  interface Props {
    updateInformationForm: SuperValidated<Infer<UpdateInformationSchema>>;
  }

  const { updateInformationForm }: Props = $props();

  const form = superForm(updateInformationForm, {
    validators: zodClient(updateInformationSchema),
    id: 'updateInformationForm',
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

  const user = $derived($page.data.user);

  $effect(() => {
    $formData.firstName = user?.user_metadata.firstname ?? '';
    $formData.middleName = user?.user_metadata.middlename ?? '';
    $formData.lastName = user?.user_metadata.lastname ?? '';
    $formData.phone = user?.user_metadata.phone ?? '';
    $formData.department = user?.user_metadata.department ?? '';
    return () => {
      $formData.firstName = '';
      $formData.middleName = '';
      $formData.lastName = '';
      $formData.phone = '';
      $formData.department = '';
    };
  });
</script>

<form
  method="POST"
  action="?/updateInformationEvent"
  use:enhance
  class="flex w-[290px] flex-col gap-2.5"
>
  <Form.Field {form} name="firstName">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>First Name</Form.Label>
        <Input {...props} bind:value={$formData.firstName} placeholder="Enter first name" />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="middleName">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Middle Name</Form.Label>
        <Input {...props} bind:value={$formData.middleName} placeholder="Enter middle name" />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="lastName">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Last Name</Form.Label>
        <Input {...props} bind:value={$formData.lastName} placeholder="Enter last name" />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="phone">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Phone</Form.Label>
        <Input {...props} bind:value={$formData.phone} placeholder="Enter phone number" />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="department">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Department</Form.Label>
        <Input {...props} bind:value={$formData.department} placeholder="Enter department" />
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

    Update Information
  </Form.Button>
</form>
