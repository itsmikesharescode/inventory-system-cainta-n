import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { addReservationSchema } from './components/add-reservation/schema';
import { fail } from '@sveltejs/kit';
import streamReservations from '$lib/db-calls/streamReservations';

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

    console.log(form.data);
  }
};