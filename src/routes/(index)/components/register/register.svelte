<script lang="ts">
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';
  import { type RegisterSchema, registerSchema } from './schema';
  import { type SuperValidated, type Infer } from 'sveltekit-superforms';
  import DepartmentPicker from '$lib/components/general/custom-pickers/department-picker.svelte';
  import { generateRefId } from '$lib';
  import { page } from '$app/state';

  interface Props {
    registerForm: SuperValidated<Infer<RegisterSchema>>;
  }

  const { registerForm }: Props = $props();

  const form = superForm(registerForm, {
    validators: zodClient(registerSchema),
    id: 'registerForm',
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

  let departments = $state<Awaited<ReturnType<typeof getDepartments>>>(null);
  const getDepartments = async () => {
    if (!page.data.supabase) return null;

    const { data, error } = await page.data.supabase
      .from('entries_departments_tb')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return null;
    return data;
  };

  $effect(() => {
    getDepartments().then((deps) => {
      departments = deps;
    });

    $formData.teacherId = generateRefId(12);
    return () => {
      $formData.teacherId = '';
    };
  });
</script>

<div class="flex flex-col items-center gap-2.5 md:py-20">
  <h1 class="scroll-m-20 text-2xl font-semibold tracking-tight">Register</h1>

  <form method="POST" action="?/registerEvent" use:enhance class="flex w-[290px] flex-col gap-2.5">
    <Form.Field {form} name="teacherId">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Teacher ID</Form.Label>
          <Input {...props} bind:value={$formData.teacherId} placeholder="Enter teacher id" />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

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
          <Form.Label>Phone Number</Form.Label>
          <Input {...props} bind:value={$formData.phone} placeholder="Enter phone number" />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="department_id">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Department</Form.Label>
          <DepartmentPicker
            bind:department_id={$formData.department_id}
            departments={departments ?? []}
          />
          <input type="hidden" {...props} bind:value={$formData.department_id} />
        {/snippet}
      </Form.Control>
      <Form.Description />
      <Form.FieldErrors />
    </Form.Field>

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

    <Form.Field {form} name="confirmPassword">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Confirm Password</Form.Label>
          <Input
            type="password"
            {...props}
            bind:value={$formData.confirmPassword}
            placeholder="Confirm password"
          />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Button disabled={$submitting} class="relative">
      {#if $submitting}
        <div
          class="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center gap-1.5 rounded-lg bg-primary"
        >
          <LoaderCircle class="h-[20px] w-[20px] animate-spin" />
        </div>
      {/if}

      Create Account
    </Form.Button>
  </form>

  <span class="mt-10 text-sm leading-7">Already have an account?</span>
  <a href="/" class="text-sm underline transition-all hover:text-primary">Log in here</a>
</div>
