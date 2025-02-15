import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { addAccountSchema } from './components/add-account/schema';
import { fail } from '@sveltejs/kit';
import { updateAccountSchema } from './components/update-account/schema';
import { deleteAccountSchema } from './components/delete-account/schema';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const getAccounts = async () => {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('teachers_tb')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return null;
    return data;
  };

  return {
    addAccountForm: await superValidate(zod(addAccountSchema)),
    updateAccountForm: await superValidate(zod(updateAccountSchema)),
    deleteAccountForm: await superValidate(zod(deleteAccountSchema)),
    getTeachers: getAccounts()
  };
};

export const actions: Actions = {
  addAccountEvent: async ({ request, locals: { supabaseAdmin } }) => {
    const form = await superValidate(request, zod(addAccountSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabaseAdmin.auth.admin.createUser({
      email: form.data.email,
      password: form.data.password,
      email_confirm: true,
      user_metadata: {
        role: 'teacher',
        email: form.data.email,
        teacher_id: form.data.teacher_id,
        firstname: form.data.firstname,
        middlename: form.data.middlename,
        lastname: form.data.lastname,
        phone: form.data.phone,
        department_id: form.data.department_id
      }
    });

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Account added successfully' };
  },
  updateAccountEvent: async ({ request, locals: { supabaseAdmin } }) => {
    const form = await superValidate(request, zod(updateAccountSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabaseAdmin.auth.admin.updateUserById(form.data.user_id, {
      email: form.data.email,
      password: form.data.password,
      user_metadata: {
        email: form.data.email,
        teacher_id: form.data.teacher_id,
        firstname: form.data.firstname,
        middlename: form.data.middlename,
        lastname: form.data.lastname,
        phone: form.data.phone,
        department_id: form.data.department_id
      }
    });

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Account updated successfully' };
  },
  removeAccountEvent: async ({ request, locals: { supabaseAdmin } }) => {
    const form = await superValidate(request, zod(deleteAccountSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(form.data.user_id);

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Account deleted successfully' };
  }
};
