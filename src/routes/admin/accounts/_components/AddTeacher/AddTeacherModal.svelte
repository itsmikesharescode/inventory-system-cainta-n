<script lang="ts">
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import Button from '$lib/components/ui/button/button.svelte';
  import { LoaderCircle, Plus, X } from 'lucide-svelte';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { ScrollArea } from '$lib/components/ui/scroll-area/index';
  import { addTeacherSchema, type AddTeacherSchema } from './schema';

  interface Props {
    addTeacherForm: SuperValidated<Infer<AddTeacherSchema>>;
  }

  const { addTeacherForm }: Props = $props();

  let open = $state(false);

  const form = superForm(addTeacherForm, {
    validators: zodClient(addTeacherSchema),
    id: crypto.randomUUID(),
    async onUpdate({ result }) {
      const { status, data } = result;
      switch (status) {
        case 200:
          toast.success('', { description: data.msg });
          open = false;
          break;

        case 401:
          toast.error('', { description: data.msg });
          break;
      }
    }
  });

  const { form: formData, enhance, submitting } = form;
</script>

<Button onclick={() => (open = true)} class="gap-1.5">
  <Plus class="h-[20px] w-[20px]" />
  Add Teacher
</Button>
<AlertDialog.Root bind:open>
  <AlertDialog.Content class="p-0">
    <ScrollArea class="max-h-screen md:max-h-[80dvh]">
      <button
        onclick={() => {
          open = false;
          form.reset();
        }}
        class="absolute right-4 top-4 z-30 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
      >
        <X class="h-4 w-4" />
        <span class="sr-only">Close</span>
      </button>

      <AlertDialog.Header class="sticky top-0 z-20 rounded-t-lg p-5 backdrop-blur-lg">
        <AlertDialog.Title>Add Teacher</AlertDialog.Title>
        <AlertDialog.Description>
          Kindly fill all the following fields to add a teacher.
        </AlertDialog.Description>
      </AlertDialog.Header>

      <form
        method="POST"
        action="?/addTeacherEvent"
        use:enhance
        class="flex flex-col gap-2.5 p-5 pt-0"
      >
        <Form.Field {form} name="teacherId">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Teacher ID</Form.Label>
              <Input {...props} bind:value={$formData.teacherId} placeholder="Enter teacher id" />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="fName">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>First Name</Form.Label>
              <Input {...props} bind:value={$formData.fName} placeholder="Enter first name" />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="mName">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Middle Name</Form.Label>
              <Input {...props} bind:value={$formData.mName} placeholder="Enter middle name" />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="lName">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Last Name</Form.Label>
              <Input {...props} bind:value={$formData.lName} placeholder="Enter last name" />
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

        <Form.Field {form} name="department">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Department</Form.Label>
              <Input {...props} bind:value={$formData.department} placeholder="Enter department" />
            {/snippet}
          </Form.Control>
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

        <Form.Field {form} name="pwd">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Password</Form.Label>
              <Input
                type="password"
                {...props}
                bind:value={$formData.pwd}
                placeholder="Enter password"
              />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="confirmPwd">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Confirm Password</Form.Label>
              <Input
                type="password"
                {...props}
                bind:value={$formData.confirmPwd}
                placeholder="Confirm password"
              />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <div class="sticky bottom-[1rem] left-0 right-0 flex justify-end">
          <Form.Button disabled={$submitting} class="relative  max-w-fit">
            {#if $submitting}
              <div
                class="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center gap-1.5 rounded-lg bg-primary"
              >
                <LoaderCircle class="h-[20px] w-[20px] animate-spin" />
              </div>
            {/if}

            Add Teacher
          </Form.Button>
        </div>
      </form>
    </ScrollArea>
  </AlertDialog.Content>
</AlertDialog.Root>
