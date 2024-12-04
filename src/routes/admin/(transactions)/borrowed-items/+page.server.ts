import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { addBorrowerSchema } from './components/add-borrower/schema';
import { fail } from '@sveltejs/kit';
import streamBorrowersUsersItems from '$lib/db-calls/streamBorrowersUsersItems';
import { updateBorrowerSchema } from './components/update-borrower/schema';
import { deleteBorrowerSchema } from './components/delete-borrower/schema';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  return {
    addBorrowerForm: await superValidate(zod(addBorrowerSchema)),
    updateBorrowerForm: await superValidate(zod(updateBorrowerSchema)),
    deleteBorrowerForm: await superValidate(zod(deleteBorrowerSchema)),
    getBorrowers: streamBorrowersUsersItems(supabase)
  };
};

export const actions: Actions = {
  addBorrowerEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(addBorrowerSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabase.from('borrowed_items_tb').insert({
      user_id: form.data.user_id,
      item_id: form.data.item_id,
      date: form.data.date,
      time: form.data.time,
      room: form.data.room
    });

    if (error) {
      return fail(401, { form, msg: error.message });
    }

    return { form, msg: 'Borrower added successfully' };
  },

  updateBorrowerEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(updateBorrowerSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabase
      .from('borrowed_items_tb')
      .update({
        user_id: form.data.user_id,
        item_id: form.data.item_id,
        room: form.data.room,
        date: form.data.date,
        time: form.data.time
      })
      .eq('id', form.data.id);

    if (error) {
      return fail(401, { form, msg: error.message });
    }

    return { form, msg: 'Borrower updated successfully' };
  },

  deleteBorrowerEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(deleteBorrowerSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabase.from('borrowed_items_tb').delete().eq('id', form.data.id);

    if (error) {
      return fail(401, { form, msg: error.message });
    }

    return { form, msg: 'Borrower deleted successfully' };
  }
};
