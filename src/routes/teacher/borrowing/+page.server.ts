import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { borrowItemSchema } from './components/borrow-item/schema';
import { fail } from '@sveltejs/kit';
import { generateRefId } from '$lib';

export const load: PageServerLoad = async ({ locals: { supabase, user } }) => {
  const getBorrowers = async () => {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('transaction_borrowed_items_tb')
      .select('*, items_tb(*), entries_rooms_tb(*)')
      .eq('user_id', user?.id ?? '')
      .order('created_at', { ascending: false });

    if (error) return null;

    return data;
  };

  return {
    borrowItemForm: await superValidate(zod(borrowItemSchema)),
    getBorrowers: getBorrowers()
  };
};

export const actions: Actions = {
  borrowItemEvent: async ({ request, locals: { supabase, user } }) => {
    const form = await superValidate(request, zod(borrowItemSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabase.rpc('admin_add_borrower', {
      user_id_param: user?.id ?? '',
      item_id_param: form.data.item_id,
      date_param: form.data.returned_date,
      time_param: form.data.returned_time,
      reference_id_param: generateRefId(8),
      room_id_param: form.data.room_id,
      quantity_param: form.data.quantity
    });

    if (error) {
      return fail(401, { form, msg: error.message });
    }

    return { form, msg: 'Borrower added successfully' };
  }
};
