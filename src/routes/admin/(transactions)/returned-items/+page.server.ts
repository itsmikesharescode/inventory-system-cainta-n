import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { addReturneeSchema } from './components/add-returnee/schema';
import { fail } from '@sveltejs/kit';
import streamReturnedItemsUsersItems from '$lib/db-calls/streamReturnedItemsUsersItems';
import { generateRefId } from '$lib';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  return {
    addReturneeForm: await superValidate(zod(addReturneeSchema)),
    getReturnees: streamReturnedItemsUsersItems(supabase)
  };
};

export const actions: Actions = {
  addReturneeEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(addReturneeSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    console.log(form.data);
  }
};
