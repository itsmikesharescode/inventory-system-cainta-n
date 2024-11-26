import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { addItemSchema } from './_components/AddItem/schema';
import { fail, redirect } from '@sveltejs/kit';
import { updateItemSchema } from './_components/UpdateItem/schema';

export const load: PageServerLoad = async () => {
  return {
    addItemForm: await superValidate(zod(addItemSchema)),
    updateItemForm: await superValidate(zod(updateItemSchema))
  };
};

export const actions: Actions = {
  addItemEvent: async ({ locals: { supabase, user }, request }) => {
    const form = await superValidate(request, zod(addItemSchema));
    if (!user) redirect(303, '/?error=no-session');
    if (!form.valid) return fail(400, { form });

    const { error } = await supabase.from('items_tb').insert([
      {
        admin_id: user.id,
        device_id: form.data.deviceId,
        model: form.data.model,
        category: form.data.category,
        type: form.data.type,
        status: form.data.status,
        mr: form.data.mr,
        brand: form.data.brand,
        quantity: form.data.quantity,
        price: form.data.price,
        description: form.data.description
      }
    ]);

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Item added.' };
  },

  updateItemEvent: async ({ locals: { supabase }, request }) => {
    const form = await superValidate(request, zod(updateItemSchema));

    if (!form.valid) return fail(400, { form });

    const { error } = await supabase
      .from('items_tb')
      .update([
        {
          device_id: form.data.deviceId,
          model: form.data.model,
          category: form.data.category,
          type: form.data.type,
          status: form.data.status,
          mr: form.data.mr,
          brand: form.data.brand,
          quantity: form.data.quantity,
          price: form.data.price,
          description: form.data.description
        }
      ])
      .eq('id', form.data.itemId);
    if (error) return fail(401, { form, msg: error.message });
    return { form, msg: 'Item updated.' };
  },

  deleteItemEvent: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const itemId = formData.get('itemId') as string;

    const { error } = await supabase.from('items_tb').delete().eq('id', Number(itemId));

    if (error) return fail(401, { msg: error.message });
    return { msg: 'Item deleted.' };
  }
};
