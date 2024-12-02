import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { addItemSchema } from './components/add-item/schema';
import { fail } from '@sveltejs/kit';
import { streamItems } from '$lib/db-calls/streamItems';
import { updateItemSchema } from './components/update-item/schema';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  return {
    addItemForm: await superValidate(zod(addItemSchema)),
    updateItemForm: await superValidate(zod(updateItemSchema)),
    getItems: streamItems(supabase)
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
  updateItemEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(updateItemSchema));
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
  removeItemEvent: async ({ request, locals: { supabase } }) => {}
};
