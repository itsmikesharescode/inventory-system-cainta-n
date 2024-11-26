<script lang="ts">
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import { LoaderCircle, X } from 'lucide-svelte';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { ScrollArea } from '$lib/components/ui/scroll-area/index';
  import { addReturneSchema, type AddReturneSchema } from './schema';
  import Button from '$lib/components/ui/button/button.svelte';
  import DatePicker from '$lib/components/gen/DatePicker.svelte';
  import ReturnedItem from './ReturnedItem.svelte';

  interface Props {
    addReturneForm: SuperValidated<Infer<AddReturneSchema>>;
  }

  const { addReturneForm }: Props = $props();

  let open = $state(false);

  const form = superForm(addReturneForm, {
    validators: zodClient(addReturneSchema),
    id: crypto.randomUUID(),
    dataType: 'json',
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

<Button onclick={() => (open = true)}>Add Returnee</Button>

<AlertDialog.Root bind:open>
  <AlertDialog.Content class="p-0">
    <ScrollArea class="max-h-screen lg:max-h-[80dvh]">
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
        <AlertDialog.Title>Add Returnee</AlertDialog.Title>
        <AlertDialog.Description>
          Kindly fill all the following fields to add a returnee.
        </AlertDialog.Description>
      </AlertDialog.Header>

      <form
        method="POST"
        action="?/addReturneEvent"
        use:enhance
        class="flex flex-col gap-2.5 p-5 pt-0"
      >
        <Form.Field {form} name="teacherRealId">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Teacher ID</Form.Label>
              <Input
                {...props}
                bind:value={$formData.teacherRealId}
                placeholder="Enter teacher id"
              />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="referenceId">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Reference ID</Form.Label>
              <Input
                {...props}
                bind:value={$formData.referenceId}
                placeholder="Enter reference id"
              />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="borrowerName">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Borrower Name</Form.Label>
              <Input
                {...props}
                bind:value={$formData.borrowerName}
                placeholder="Enter reference id"
              />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="borrowedDate">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Borrowed Date</Form.Label>
              <DatePicker
                class="w-full"
                formProps={props}
                bind:dateString={$formData.borrowedDate}
              />
              <input type="hidden" bind:value={$formData.borrowedDate} name={props.name} />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="itemsReturned">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Items Returned</Form.Label>
              <ReturnedItem
                referenceId={$formData.referenceId}
                bind:selectedItems={$formData.itemsReturned}
              />
              <input {...props} type="hidden" value={$formData.itemsReturned} />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="returnedDate">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Returned Date</Form.Label>
              <DatePicker
                class="w-full"
                formProps={props}
                bind:dateString={$formData.returnedDate}
              />
              <input type="hidden" bind:value={$formData.returnedDate} name={props.name} />
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
