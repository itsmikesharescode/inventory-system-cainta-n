<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { addAccountSchema, type AddAccountSchema } from './schema';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import Plus from 'lucide-svelte/icons/plus';
  import Textarea from '$lib/components/ui/textarea/textarea.svelte';
  import SelectPicker from '$lib/components/general/select-picker.svelte';
  import { categoriesMeta, typeMeta } from '$lib';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { generateRefId } from '$lib';
  import { toast } from 'svelte-sonner';
  import DepartmentPicker from '$lib/components/general/department-picker.svelte';

  interface Props {
    addAccountForm: SuperValidated<Infer<AddAccountSchema>>;
  }

  const { addAccountForm }: Props = $props();

  let open = $state(false);

  const form = superForm(addAccountForm, {
    validators: zodClient(addAccountSchema),
    id: 'add-account-form',
    onUpdate: async ({ result }) => {
      const { status, data } = result;

      switch (status) {
        case 200:
          toast.success(data.msg);
          reset();
          open = false;
          break;
        case 401:
          toast.error(data.msg);
          break;
      }
    }
  });

  const { form: formData, enhance, submitting, reset } = form;

  $effect(() => {
    if (open) {
      $formData.teacher_id = generateRefId(12);

      return () => {
        reset();
      };
    }
  });
</script>

<Button onclick={() => (open = true)} class="items-center"><Plus /> New Account</Button>
<Dialog.Root bind:open>
  <Dialog.Content class="max-h-[80dvh] max-w-4xl overflow-y-auto">
    <Dialog.Header>
      <Dialog.Title>Add Account</Dialog.Title>
    </Dialog.Header>

    <form method="POST" action="?/addAccountEvent" use:enhance>
      <section class="grid grid-cols-3 gap-2.5">
        <div class="">
          <Form.Field {form} name="firstname">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>First Name</Form.Label>
                <Input {...props} bind:value={$formData.firstname} placeholder="Enter First Name" />
              {/snippet}
            </Form.Control>
            <Form.Description />
            <Form.FieldErrors />
          </Form.Field>

          <Form.Field {form} name="middlename">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Middle Name</Form.Label>
                <Input
                  {...props}
                  bind:value={$formData.middlename}
                  placeholder="Enter Middle Name"
                />
              {/snippet}
            </Form.Control>
            <Form.Description />
            <Form.FieldErrors />
          </Form.Field>

          <Form.Field {form} name="lastname">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Last Name</Form.Label>
                <Input {...props} bind:value={$formData.lastname} placeholder="Enter Last Name" />
              {/snippet}
            </Form.Control>
            <Form.Description />
            <Form.FieldErrors />
          </Form.Field>
        </div>

        <div class="">
          <Form.Field {form} name="teacher_id">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Teacher ID</Form.Label>
                <Input
                  {...props}
                  bind:value={$formData.teacher_id}
                  placeholder="Enter Teacher ID"
                />
              {/snippet}
            </Form.Control>
            <Form.Description />
            <Form.FieldErrors />
          </Form.Field>
          <Form.Field {form} name="email">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Email</Form.Label>
                <Input {...props} bind:value={$formData.email} placeholder="Enter Email" />
              {/snippet}
            </Form.Control>
            <Form.Description />
            <Form.FieldErrors />
          </Form.Field>

          <Form.Field {form} name="phone">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Phone</Form.Label>
                <Input {...props} bind:value={$formData.phone} placeholder="Enter Phone" />
              {/snippet}
            </Form.Control>
            <Form.Description />
            <Form.FieldErrors />
          </Form.Field>
        </div>

        <div class="">
          <Form.Field {form} name="department">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Department</Form.Label>
                <DepartmentPicker bind:code={$formData.department} />
                <input type="hidden" {...props} bind:value={$formData.department} />
              {/snippet}
            </Form.Control>
            <Form.Description />
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
                  placeholder="Enter Password"
                />
              {/snippet}
            </Form.Control>
            <Form.Description />
            <Form.FieldErrors />
          </Form.Field>

          <Form.Field {form} name="confirm_password">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Password</Form.Label>
                <Input
                  type="password"
                  {...props}
                  bind:value={$formData.confirm_password}
                  placeholder="Enter Confirm Password"
                />
              {/snippet}
            </Form.Control>
            <Form.Description />
            <Form.FieldErrors />
          </Form.Field>
        </div>
      </section>

      <section class="flex justify-end">
        <Form.Button disabled={$submitting} class="relative">
          {#if $submitting}
            <div class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary">
              <LoaderCircle class="h-[20px] w-[20px] animate-spin" />
            </div>
          {/if}
          Create
        </Form.Button>
      </section>
    </form>
  </Dialog.Content>
</Dialog.Root>
