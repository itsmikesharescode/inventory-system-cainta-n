import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { addReturneeSchema } from './components/add-returnee/schema';
import { fail } from '@sveltejs/kit';
import streamReturnedItemsUsersItems from '$lib/db-calls/streamReturnedItemsUsersItems';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  return {
    addReturneeForm: await superValidate(zod(addReturneeSchema)),
    getReturnees: streamReturnedItemsUsersItems(supabase)
  };
};

export const actions: Actions = {
  addReturneeEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(addReturneeSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabase.from('returned_items_tb').insert({
      borrowed_item_id: Number(form.data.borrowed_item_id),
      returned_date: form.data.returned_date,
      time: form.data.time
    });
    console.log(form.data.borrowed_item_id);
    console.log(error?.message);
    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Returnee event added successfully' };
  }
};
