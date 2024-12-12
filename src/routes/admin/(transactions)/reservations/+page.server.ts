import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { addReservationSchema } from './components/add-reservation/schema';
import { fail } from '@sveltejs/kit';
import streamReservationsUsersItems from '$lib/db-calls/streamReservationsUsersItems';
import { updateReservationSchema } from './components/update-reservation/schema';
import { deleteReservationSchema } from './components/delete-reservation/schema';
import { updateStatusReservationSchema } from './components/update-status-reservation/schema';
import { generateRefId } from '$lib';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	return {
		addReservationForm: await superValidate(zod(addReservationSchema)),
		updateReservationForm: await superValidate(zod(updateReservationSchema)),
		deleteReservationForm: await superValidate(zod(deleteReservationSchema)),
		updateStatusReservationForm: await superValidate(zod(updateStatusReservationSchema)),
		getReservations: streamReservationsUsersItems(supabase)
	};
};

export const actions: Actions = {
	addReservationEvent: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(addReservationSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { error } = await supabase.from('reservations_tb').insert({
			reference_id: generateRefId(8),
			user_id: form.data.user_id,
			item_id: form.data.item_id,
			quantity: form.data.quantity,
			room_id: form.data.room_id,
			date: form.data.date,
			time: form.data.time
		});

		if (error) {
			return fail(401, { form, msg: error.message });
		}

		return { form, msg: 'Reservation added successfully' };
	},
	updateReservationEvent: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(updateReservationSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { error } = await supabase
			.from('reservations_tb')
			.update({
				user_id: form.data.user_id,
				item_id: form.data.item_id,
				quantity: form.data.quantity,
				room_id: form.data.room_id,
				date: form.data.date,
				time: form.data.time
			})
			.eq('id', form.data.id);

		if (error) {
			return fail(401, { form, msg: error.message });
		}

		return { form, msg: 'Reservation updated successfully' };
	},
	removeReservationEvent: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(deleteReservationSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { error } = await supabase.from('reservations_tb').delete().eq('id', form.data.id);

		if (error) {
			return fail(401, { form, msg: error.message });
		}

		return { form, msg: 'Reservation deleted successfully' };
	},
	updateStatusReservationEvent: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(updateStatusReservationSchema));

		if (!form.valid) {
			return fail(400, { form });
		}
		console.log(form.data);
		const { error } = await supabase.rpc('general_update_reservation_status', {
			reservation_id_client: form.data.reservation_id_client,
			item_id_param_client: form.data.item_id_param_client,
			status_client: form.data.status_client,
			user_id_client: form.data.user_id_client,
			date_client: form.data.date_client,
			time_client: form.data.time_client,
			reference_id_client: form.data.reference_id_client,
			room_id_client: form.data.room_id_client
		});

		if (error) {
			return fail(401, { form, msg: error.message });
		}

		return { form, msg: 'Reservation status updated successfully' };
	}
};
