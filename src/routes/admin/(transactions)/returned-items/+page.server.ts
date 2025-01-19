import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { deleteReturneeSchema } from './components/delete-returnee/schema';

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

  return {
    deleteReturneeForm: await superValidate(zod(deleteReturneeSchema)),
    returnees: getReturnees()
  };
};

export const actions: Actions = {
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
