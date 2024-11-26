<script lang="ts">
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import { LoaderCircle, X } from 'lucide-svelte';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { ScrollArea } from '$lib/components/ui/scroll-area/index';
  import { createReservationSchema, type CreateReservationSchema } from './schema';
  import Button from '$lib/components/ui/button/button.svelte';
  import DatePicker from '$lib/components/gen/DatePicker.svelte';

  interface Props {
    createReservationForm: SuperValidated<Infer<CreateReservationSchema>>;
  }

  const { createReservationForm }: Props = $props();

  let open = $state(false);

  const form = superForm(createReservationForm, {
    validators: zodClient(createReservationSchema),
    id: crypto.randomUUID(),
    async onUpdate({ result }) {
      const { status, data } = result;
      switch (status) {
        case 200:
          toast.success('', { description: data.msg });
          form.reset();
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

<Button onclick={() => (open = true)}>Create Reservation</Button>

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
        <AlertDialog.Title>Create Reservation</AlertDialog.Title>
        <AlertDialog.Description>
          Kindly fill all the following fields to add a reservation.
        </AlertDialog.Description>
      </AlertDialog.Header>

      <form
        method="POST"
        action="?/createResEvent"
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

        <Form.Field {form} name="teacherName">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Teacher Name</Form.Label>
              <Input
                {...props}
                bind:value={$formData.teacherName}
                placeholder="Enter teacher name"
              />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="maxItems">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Max Items</Form.Label>
              <Input
                type="number"
                {...props}
                bind:value={$formData.maxItems}
                placeholder="Enter max items"
              />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="room">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Room</Form.Label>
              <Input {...props} bind:value={$formData.room} placeholder="Enter room" />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="date">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Select Date</Form.Label>
              <DatePicker formProps={props} class="w-full" bind:dateString={$formData.date} />
              <input type="hidden" name={props.name} value={$formData.date} />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="time">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Time</Form.Label>
              <Input {...props} bind:value={$formData.time} placeholder="Enter time" />
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

            Add
          </Form.Button>
        </div>
      </form>
    </ScrollArea>
  </AlertDialog.Content>
</AlertDialog.Root>
