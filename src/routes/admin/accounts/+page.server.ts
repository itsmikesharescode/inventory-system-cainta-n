import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { addTeacherSchema } from './_components/AddTeacher/schema';
import { fail } from '@sveltejs/kit';
import { updateTeacherSchema } from './_components/UpdateTeacher/schema';

export const load: PageServerLoad = async () => {
  return {
    addTeacherForm: await superValidate(zod(addTeacherSchema)),
    updateTeacherForm: await superValidate(zod(updateTeacherSchema))
  };
};

export const actions: Actions = {
  addTeacherEvent: async ({ locals: { supabaseAdmin }, request }) => {
    const form = await superValidate(request, zod(addTeacherSchema));

    if (!form.valid) return fail(400, { form });

    const {
      data: { user },
      error
    } = await supabaseAdmin.auth.admin.createUser({
      email: form.data.email,
      password: form.data.pwd,
      email_confirm: true,
      user_metadata: {
        role: 'teacher',
        teacher_real_id: form.data.teacherId,
        email: form.data.email,
        firstname: form.data.fName,
        middlename: form.data.mName,
        lastname: form.data.lName,
        phonenumber: form.data.phone,
        department: form.data.department
      }
    });

    if (error) return fail(401, { form, msg: error.message });
    else if (user) return { form, msg: 'Success created.' };
    return fail(401, { form, msg: 'Something went wrong.' });
  },

  updateTeacherEvent: async ({ locals: { supabaseAdmin }, request }) => {
    const form = await superValidate(request, zod(updateTeacherSchema));

    if (!form.valid) return fail(400, { form });

    const { error } = await supabaseAdmin.auth.admin.updateUserById(form.data.userId, {
      email: form.data.email,
      password: form.data.pwd,
      user_metadata: {
        teacher_real_id: form.data.teacherId,
        email: form.data.email,
        firstname: form.data.fName,
        middlename: form.data.mName,
        lastname: form.data.lName,
        phonenumber: form.data.phone,
        department: form.data.department
      }
    });

    if (error) return fail(401, { form, msg: error.message });
    return { form, msg: 'Success updated.' };
  },

  deleteTeacherEvent: async ({ locals: { supabaseAdmin }, request }) => {
    const formData = await request.formData();
    const teacherId = formData.get('teacherId') as string;

    const { error } = await supabaseAdmin.auth.admin.deleteUser(teacherId);

    if (error) return fail(401, { msg: error.message });
    return { msg: 'You have deleted the teacher.' };
  }
};
