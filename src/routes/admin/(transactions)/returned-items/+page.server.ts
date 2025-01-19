import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { deleteReturneeSchema } from './components/delete-returnee/schema';
import { disposeReturneeSchema } from './components/dispose-returnee/schema';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const getReturnees = async () => {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('transaction_returned_items_tb')
      .select('*, teachers_tb(*), items_tb(*), entries_rooms_tb(*)')
      .order('created_at', { ascending: false });

    if (error) return null;
    return data;
  };

  const getDisposes = async () => {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('transaction_dispose_tb')
      .select('*, teachers_tb(*), items_tb(*), entries_rooms_tb(*)')
      .order('created_at', { ascending: false });

    if (error) return null;

    return data;
  };

  return {
    disposeReturneeForm: await superValidate(zod(disposeReturneeSchema)),
    deleteReturneeForm: await superValidate(zod(deleteReturneeSchema)),
    returnees: getReturnees(),
    disposes: getDisposes()
  };
};

export const actions: Actions = {
  disposeReturneeEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(disposeReturneeSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabase.rpc('dispose_returnee', {
      id_input: form.data.id,
      user_id_input: form.data.user_id,
      item_id_input: form.data.item_id,
      room_id_input: form.data.room_id,
      reference_id_input: form.data.reference_id,
      quantity_input: form.data.quantity,
      remarks_input: form.data.remarks,
      borrowed_date_input: form.data.borrowed_date
    });

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Returnee disposed successfully' };
  },

  deleteReturneeEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(deleteReturneeSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabase
      .from('transaction_returned_items_tb')
      .delete()
      .eq('id', form.data.id);

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Returnee deleted successfully' };
  }
};
