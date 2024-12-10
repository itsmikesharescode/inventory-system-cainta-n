import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { addRoomSchema } from './components/add-room/schema';
import { fail } from '@sveltejs/kit';

import { updateRoomSchema } from './components/update-room/schema';
import { deleteRoomSchema } from './components/delete-room/schema';
import streamRooms from '$lib/db-calls/streamRooms';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  return {
    addRoomForm: await superValidate(zod(addRoomSchema)),
    updateRoomForm: await superValidate(zod(updateRoomSchema)),
    deleteRoomForm: await superValidate(zod(deleteRoomSchema)),
    getRooms: streamRooms(supabase)
  };
};

export const actions: Actions = {
  addRoomEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(addRoomSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabase.from('rooms_tb').insert({
      name: form.data.name,
      number: form.data.number
    });

    if (error) {
      return fail(401, { form, msg: error.message });
    }

    return { form, msg: 'Room added successfully' };
  },
  updateRoomEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(updateRoomSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabase
      .from('rooms_tb')
      .update({
        name: form.data.name,
        number: form.data.number
      })
      .eq('id', form.data.id);

    if (error) {
      return fail(401, { form, msg: error.message });
    }

    return { form, msg: 'Room updated successfully' };
  },
  removeRoomEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(deleteRoomSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabase.from('rooms_tb').delete().eq('id', form.data.id);

    if (error) {
      return fail(401, { form, msg: error.message });
    }

    return { form, msg: 'Room removed successfully' };
  }
};
