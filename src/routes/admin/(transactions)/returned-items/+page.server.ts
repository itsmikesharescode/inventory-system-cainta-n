import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { deleteReturneeSchema } from './components/delete-returnee/schema';
import streamReturnedItemUser from '$lib/db-calls/streamReturnedItemUser';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	return {
		deleteReturneeForm: await superValidate(zod(deleteReturneeSchema)),
		getReturnees: streamReturnedItemUser(supabase)
	};
};

export const actions: Actions = {
	deleteReturneeEvent: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(deleteReturneeSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { error } = await supabase.from('returned_items_tb').delete().eq('id', form.data.id);

		if (error) return fail(401, { form, msg: error.message });

		return { form, msg: 'Returnee deleted successfully' };
	}
};
