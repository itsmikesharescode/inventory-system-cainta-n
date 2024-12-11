import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { addReturneeSchema } from './components/add-returnee/schema';
import { fail } from '@sveltejs/kit';
import streamReturnedItemsUsersItems from '$lib/db-calls/streamReturnedItemsUsersItems';
import { updateReturneeSchema } from './components/update-returnee/schema';
import { deleteReturneeSchema } from './components/delete-returnee/schema';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  return {
    addReturneeForm: await superValidate(zod(addReturneeSchema)),
    updateReturneeForm: await superValidate(zod(updateReturneeSchema)),
    deleteReturneeForm: await superValidate(zod(deleteReturneeSchema)),
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
      remarks: form.data.remarks,
      borrowed_item_id: Number(form.data.borrowed_item_id),
      returned_date: form.data.returned_date,
      time: form.data.time
    });
    console.log(form.data.borrowed_item_id);
    console.log(error?.message);
    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Returnee added successfully' };
  },
  updateReturneeEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(updateReturneeSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabase
      .from('returned_items_tb')
      .update({
        returned_date: form.data.returned_date,
        time: form.data.time,
        remarks: form.data.remarks
      })
      .eq('id', form.data.id);

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Returnee updated successfully' };
  },
  deleteReturneeEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(deleteReturneeSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabase.from('returned_items_tb').delete().eq('id', form.data.id);

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Returnee deleted successfully' };
  }
};
