import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { addBorrowerSchema } from './_components/AddBorrower/schema';
import { fail } from '@sveltejs/kit';
import { updateBorrowerSchema } from './_components/UpdateBorrower/schema';
import { generateRefId } from '$lib';

export const load: PageServerLoad = async () => {
  return {
    addBorrowerForm: await superValidate(zod(addBorrowerSchema)),
    updateBorrowerForm: await superValidate(zod(updateBorrowerSchema))
  };
};

export const actions: Actions = {
  addBorrowerEvent: async ({ locals: { supabase }, request }) => {
    const form = await superValidate(request, zod(addBorrowerSchema));

    if (!form.valid) return fail(400, { form });

    const { error } = await supabase.rpc('add_borrower', {
      client_input: form.data
    });

    if (error) return fail(401, { form, msg: error.message });
    else return { form, msg: 'Successfully added.' };
  },

  updateBorrowerEvent: async ({ locals: { supabase }, request }) => {
    const form = await superValidate(request, zod(updateBorrowerSchema));
    if (!form.valid) return fail(400, { form });
    const { error } = await supabase
      .from('borrowed_items_tb')
      .update([
        {
          borrower_name: form.data.borrowerName,
          borrowed_date: form.data.borrowedDate,
          room: form.data.room,
          items_borrowed: form.data.itemsBorrowed
        }
      ])
      .eq('id', form.data.id);

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Borrowed item updated.' };
  },

  deleteBorrowerEvent: async ({ locals: { supabase }, request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;

    const { error } = await supabase.from('borrowed_items_tb').delete().eq('id', id);
    if (error) return fail(401, { msg: error.message });
    return { msg: 'Success deleted.' };
  }
};
