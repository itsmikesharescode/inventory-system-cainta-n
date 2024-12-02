import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { addAccountSchema } from './components/add-account/schema';
import { fail } from '@sveltejs/kit';
import { streamItems } from '$lib/db-calls/streamItems';
import { updateAccountSchema } from './components/update-account/schema';
import { deleteAccountSchema } from './components/delete-account/schema';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  return {
    addAccountForm: await superValidate(zod(addAccountSchema)),
    updateAccountForm: await superValidate(zod(updateAccountSchema)),
    deleteAccountForm: await superValidate(zod(deleteAccountSchema)),
    getItems: streamItems(supabase)
  };
};

export const actions: Actions = {
  addAccountEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(addAccountSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabase.from('items_tb').insert({
      ...form.data
    });

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Item added successfully' };
  },
  updateAccountEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(updateAccountSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabase
      .from('items_tb')
      .update({
        ...form.data
      })
      .eq('id', form.data.id);

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Item updated successfully' };
  },
  removeAccountEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(deleteAccountSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabase.from('items_tb').delete().eq('id', form.data.id);

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Item deleted successfully' };
  }
};
