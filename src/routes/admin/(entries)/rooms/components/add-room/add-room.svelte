<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { addRoomSchema, type AddRoomSchema } from './schema';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import Plus from 'lucide-svelte/icons/plus';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { toast } from 'svelte-sonner';

  interface Props {
    addRoomForm: SuperValidated<Infer<AddRoomSchema>>;
  }

  const { addRoomForm }: Props = $props();

  let open = $state(false);

  const form = superForm(addRoomForm, {
    validators: zodClient(addRoomSchema),
    id: 'add-room-form',
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
</script>

<Button onclick={() => (open = true)} class="items-center"><Plus /> New Room</Button>
<Dialog.Root bind:open>
  <Dialog.Content class=" overflow-y-auto">
    <Dialog.Header>
      <Dialog.Title>Add Room</Dialog.Title>
    </Dialog.Header>

    <form method="POST" action="?/addRoomEvent" use:enhance>
      <Form.Field {form} name="name">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Room Name</Form.Label>
            <Input {...props} bind:value={$formData.name} placeholder="Enter Name" />
          {/snippet}
        </Form.Control>
        <Form.Description />
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="number">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Room Number</Form.Label>
            <Input
              type="number"
              {...props}
              bind:value={$formData.number}
              placeholder="Enter Number"
            />
          {/snippet}
        </Form.Control>
        <Form.Description />
        <Form.FieldErrors />
      </Form.Field>

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
