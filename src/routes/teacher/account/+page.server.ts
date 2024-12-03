import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { updateEmailSchema } from './components/update-email/schema';
import { fail } from '@sveltejs/kit';
import { updateInformationSchema } from './components/update-information/schema';
import { updatePasswordSchema } from './components/update-password/schema';

export const load: PageServerLoad = async () => {
  return {
    updateEmailForm: await superValidate(zod(updateEmailSchema)),
    updateInformationForm: await superValidate(zod(updateInformationSchema)),
    updatePasswordForm: await superValidate(zod(updatePasswordSchema))
  };
};

export const actions: Actions = {
  updateEmailEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(updateEmailSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabase.auth.updateUser({
      email: form.data.email
    });

    if (error) {
      return fail(401, { form, msg: error.message });
    }

    return { form, msg: `An email has been sent to ${form.data.email} to verify the change` };
  },

  updateInformationEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(updateInformationSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabase.auth.updateUser({
      data: {
        firstname: form.data.firstName,
        middlename: form.data.middleName,
        lastname: form.data.lastName,
        phone: form.data.phone,
        department: form.data.department
      }
    });

    if (error) {
      return fail(401, { form, msg: error.message });
    }

    return { form, msg: 'Information updated successfully.' };
  },

  updatePasswordEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(updatePasswordSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabase.auth.updateUser({
      password: form.data.password
    });

    if (error) {
      return fail(401, { form, msg: error.message });
    }

    return { form, msg: 'Password updated successfully.' };
  }
};
