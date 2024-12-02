import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { addItemSchema } from './components/add-item/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  return {
    addItemForm: await superValidate(zod(addItemSchema))
  };
};

export const actions: Actions = {
  addItemEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(addItemSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabase.from('items_tb').insert({
      ...form.data
    });

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Item added successfully' };
  },
  updateItemEvent: async ({ request, locals: { supabase } }) => {},
  removeItemEvent: async ({ request, locals: { supabase } }) => {}
};
