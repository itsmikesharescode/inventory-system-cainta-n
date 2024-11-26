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
  import { updateReservationSchema, type UpdateReservationSchema } from './schema';
  import type { AdminLayout } from '$lib/types/admin/adminLayout.types';
  import DatePicker from '$lib/components/gen/DatePicker.svelte';
  import SelectPicker from '$lib/components/gen/SelectPicker.svelte';

  interface Props {
    updateReservationForm: SuperValidated<Infer<UpdateReservationSchema>>;
    showUpReservation: boolean;
    reservation: AdminLayout['reservations'][number];
  }

  let { updateReservationForm, showUpReservation = $bindable(), reservation }: Props = $props();

  const form = superForm(updateReservationForm, {
    validators: zodClient(updateReservationSchema),
    id: crypto.randomUUID(),
    async onUpdate({ result }) {
      const { status, data } = result;
      switch (status) {
        case 200:
          toast.success('', { description: data.msg });
          showUpReservation = false;
          break;

        case 401:
          toast.error('', { description: data.msg });
          break;
      }
    }
  });

  const { form: formData, enhance, submitting } = form;

  $effect(() => {
    if (showUpReservation) {
      const [date, time, ampm] = reservation.time_limit.split(' ');
      $formData.teacherName = reservation.teacher_name;
      $formData.maxItems = reservation.max_items;
      $formData.room = reservation.room;
      $formData.date = date;
      $formData.time = `${time} ${ampm}`;
      $formData.status = reservation.status;
    }
  });

  const selections = [
    {
      value: 'Accepted',
      label: 'Will show only accepted reservations'
    },
    {
      value: 'Pending',
      label: 'Will show only pending reservations'
    },

    {
      value: 'Canceled',
      label: 'Will show only calceled reservations'
    }
  ];
</script>

<AlertDialog.Root bind:open={showUpReservation}>
  <AlertDialog.Content class="p-0">
    <ScrollArea class="max-h-screen md:max-h-[80dvh]">
      <button
        onclick={() => {
          showUpReservation = false;
          form.reset();
        }}
        class="absolute right-4 top-4 z-30 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
      >
        <X class="h-4 w-4" />
        <span class="sr-only">Close</span>
      </button>

      <AlertDialog.Header class="sticky top-0 z-20 rounded-t-lg p-5 backdrop-blur-lg">
        <AlertDialog.Title>Update Reservation</AlertDialog.Title>
        <AlertDialog.Description>
          Kindly fill all the following fields to update this reservation.
        </AlertDialog.Description>
      </AlertDialog.Header>

      <form
        method="POST"
        action="?/updateResEvent"
        use:enhance
        class="flex flex-col gap-2.5 p-5 pt-0"
      >
        <Form.Field {form} name="id" class="hidden">
          <Form.Control>
            {#snippet children({ props })}
              <Input {...props} bind:value={reservation.id} />
            {/snippet}
          </Form.Control>
        </Form.Field>

        <Form.Field {form} name="status">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Teacher ID</Form.Label>
              <SelectPicker
                formProps={props}
                name="Select Status"
                class=""
                {selections}
                bind:value={$formData.status}
              />
              <input type="hidden" bind:value={$formData.status} name={props.name} />
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

        <!-- 


        

        <Form.Field {form} name="maxItems">
          <Form.Control let:attrs>
            <Form.Label>Max Items</Form.Label>
            <Input
              {...attrs}
              bind:value={$formData.maxItems}
              placeholder="Enter reservation date"
            />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="room">
          <Form.Control let:attrs>
            <Form.Label>Room</Form.Label>
            <Input {...attrs} bind:value={$formData.room} placeholder="Enter room" />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="date">
          <Form.Control let:attrs>
            <Form.Label>Date</Form.Label>
            <DatePicker bind:dateValue={$formData.date} name="Select date" />
            <input {...attrs} type="hidden" bind:value={$formData.date} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="time">
          <Form.Control let:attrs>
            <Form.Label>Time</Form.Label>
            <Input {...attrs} bind:value={$formData.time} placeholder="Enter time" />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field> -->

        <div class="sticky bottom-[1rem] left-0 right-0 flex justify-end">
          <Form.Button disabled={$submitting} class="relative  max-w-fit">
            {#if $submitting}
              <div
                class="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center gap-1.5 rounded-lg bg-primary"
              >
                <LoaderCircle class="h-[20px] w-[20px] animate-spin" />
              </div>
            {/if}

            Update
          </Form.Button>
        </div>
      </form>
    </ScrollArea>
  </AlertDialog.Content>
</AlertDialog.Root>
