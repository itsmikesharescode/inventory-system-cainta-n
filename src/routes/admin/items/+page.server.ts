import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { addItemSchema } from './components/add-item/schema';
import { fail } from '@sveltejs/kit';
import { updateItemSchema } from './components/update-item/schema';
import { deleteItemSchema } from './components/delete-item/schema';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const getItems = async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from('items_tb')
      .select('*, entries_categories_tb(*), entries_departments_tb(*)')
      .order('id', { ascending: false });

    if (error) return;

    return data;
  };

  return {
    addItemForm: await superValidate(zod(addItemSchema)),
    updateItemForm: await superValidate(zod(updateItemSchema)),
    deleteItemForm: await superValidate(zod(deleteItemSchema)),
    items: getItems()
  };
};

export const actions: Actions = {
  addItemEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(addItemSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabase.from('items_tb').insert({
      device_id: form.data.device_id,
      model: form.data.model ?? 'N/A',
      type: form.data.type,
      status: form.data.status,
      brand: form.data.brand,
      quantity: form.data.quantity,
      description: form.data.description,
      department_id: form.data.department_id,
      category_id: form.data.category_id
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
        device_id: form.data.device_id,
        model: form.data.model ?? 'N/A',
        type: form.data.type,
        status: form.data.status,
        brand: form.data.brand,
        description: form.data.description,
        department_id: form.data.department_id,
        category_id: form.data.category_id
      })
      .eq('id', form.data.id);

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Item updated successfully' };
  },
  removeItemEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(deleteItemSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabase.from('items_tb').delete().eq('id', form.data.id);

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Item deleted successfully' };
  }
};
