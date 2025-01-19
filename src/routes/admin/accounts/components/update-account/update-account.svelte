<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { updateAccountSchema, type UpdateAccountSchema } from './schema';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { toast } from 'svelte-sonner';
  import { useTableState } from '../table/tableState.svelte';
  import DepartmentPicker from '$lib/components/general/custom-pickers/department-picker.svelte';
  import { page } from '$app/state';

  interface Props {
    updateAccountForm: SuperValidated<Infer<UpdateAccountSchema>>;
  }

  const { updateAccountForm }: Props = $props();

  const tableState = useTableState();
  const form = superForm(updateAccountForm, {
    validators: zodClient(updateAccountSchema),
    id: 'update-account-form',
    onUpdate: async ({ result }) => {
      const { status, data } = result;

      switch (status) {
        case 200:
          toast.success(data.msg);
          reset();
          tableState.setActiveRow(null);
          tableState.setShowUpdate(false);
          break;
        case 401:
          toast.error(data.msg);
          break;
      }
    }
  });

  const { form: formData, enhance, submitting, reset } = form;

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
    if (tableState.getShowUpdate()) {
      getDepartments().then((deps) => {
        departments = deps;
      });

      $formData.user_id = tableState.getActiveRow()?.user_id ?? '';
      $formData.teacher_id = tableState.getActiveRow()?.teacher_id ?? '';
      $formData.department_id = tableState.getActiveRow()?.department_id ?? 0;
      $formData.email = tableState.getActiveRow()?.email ?? '';
      $formData.phone = tableState.getActiveRow()?.phone ?? '';
      $formData.firstname = tableState.getActiveRow()?.firstname ?? '';
      $formData.middlename = tableState.getActiveRow()?.middlename ?? '';
      $formData.lastname = tableState.getActiveRow()?.lastname ?? '';

      return () => {
        $formData.user_id = '';
        $formData.teacher_id = '';
        $formData.department_id = 0;
        $formData.email = '';
        $formData.phone = '';
        $formData.firstname = '';
        $formData.middlename = '';
        $formData.lastname = '';
        tableState.setActiveRow(null);
        tableState.setShowUpdate(false);
        reset();
      };
    }
  });
</script>

<Dialog.Root
  onOpenChange={(open) => {
    tableState.setShowUpdate(open);
  }}
  open={tableState.getShowUpdate()}
>
  <Dialog.Content class="max-h-[80dvh] max-w-4xl overflow-y-auto">
    <Dialog.Header>
      <Dialog.Title>Update Account</Dialog.Title>
    </Dialog.Header>

    <form method="POST" action="?/updateAccountEvent" use:enhance>
      <input type="hidden" name="user_id" bind:value={$formData.user_id} />
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
          Update
        </Form.Button>
      </section>
    </form>
  </Dialog.Content>
</Dialog.Root>
