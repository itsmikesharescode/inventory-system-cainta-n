import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { addReturneSchema } from './_components/AddReturnee/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  return {
    addReturneForm: await superValidate(zod(addReturneSchema))
  };
};

export const actions: Actions = {
  addReturneEvent: async ({ locals: { supabase }, request }) => {
    const form = await superValidate(request, zod(addReturneSchema));

    if (!form.valid) return fail(400, { form });
    const { error } = await supabase.rpc('add_returnee', {
      teacher_real_id_input: form.data.teacherRealId,
      reference_id_input: form.data.referenceId,
      borrower_name_input: form.data.borrowerName,
      borrowed_date_input: form.data.borrowedDate,
      returned_date_input: form.data.returnedDate,
      items_returned_input: form.data.itemsReturned
    });

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Success added returnee.' };
  },

  deleteReturneeEvent: async ({ locals: { supabase }, request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;

    const { error } = await supabase.from('returned_items_tb').delete().eq('id', Number(id));

    if (error) return fail(401, { msg: error.message });
    return { msg: 'Successfully deleted.' };
  }
};
