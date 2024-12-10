import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { addDepartmentSchema } from './components/add-department/schema';
import { fail } from '@sveltejs/kit';
import streamDepartments from '$lib/db-calls/streamDepartments';
import { updateDepartmentSchema } from './components/update-department/schema';
import { deleteDepartmentSchema } from './components/delete-department/schema';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  return {
    addDepartmentForm: await superValidate(zod(addDepartmentSchema)),
    updateDepartmentForm: await superValidate(zod(updateDepartmentSchema)),
    deleteDepartmentForm: await superValidate(zod(deleteDepartmentSchema)),
    getDepartments: streamDepartments(supabase)
  };
};

export const actions: Actions = {
  addDepartmentEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(addDepartmentSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabase.from('departments_tb').insert({
      name: form.data.name,
      code: form.data.code
    });

    if (error) {
      return fail(401, { form, msg: error.message });
    }

    return { form, msg: 'Department added successfully' };
  },
  updateDepartmentEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(updateDepartmentSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabase
      .from('departments_tb')
      .update({
        name: form.data.name,
        code: form.data.code
      })
      .eq('id', form.data.id);

    if (error) {
      return fail(401, { form, msg: error.message });
    }

    return { form, msg: 'Department updated successfully' };
  },
  removeDepartmentEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(deleteDepartmentSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabase.from('departments_tb').delete().eq('id', form.data.id);

    if (error) {
      return fail(401, { form, msg: error.message });
    }

    return { form, msg: 'Department removed successfully' };
  }
};
