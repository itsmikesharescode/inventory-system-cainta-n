import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { addReservationSchema } from './components/add-reservation/schema';
import { fail } from '@sveltejs/kit';
import streamReservations from '$lib/db-calls/streamReservations';
import { getLocalTimeZone } from '@internationalized/date';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  return {
    addReservationForm: await superValidate(zod(addReservationSchema)),
    getReservations: streamReservations(supabase)
  };
};

export const actions: Actions = {
  addReservationEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(addReservationSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabase.from('reservations_tb').insert({
      user_id: form.data.user_id,
      item_id: form.data.item_id,
      quantity: form.data.quantity,
      room: form.data.room,
      date: form.data.date,
      time: form.data.time
    });

    if (error) {
      return fail(401, { form, msg: error.message });
    }

    return { form, msg: 'Reservation added successfully' };
  }
};
