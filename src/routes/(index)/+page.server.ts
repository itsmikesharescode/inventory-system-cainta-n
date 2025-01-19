import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from './components/login/schema';
import { registerSchema } from './components/register/schema';
import { forgotPwdSchema } from './components/forgot-password/schema';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  return {
    loginForm: await superValidate(zod(loginSchema)),
    registerForm: await superValidate(zod(registerSchema)),
    forgotPwdForm: await superValidate(zod(forgotPwdSchema))
  };
};

export const actions: Actions = {
  loginEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(loginSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const {
      data: { user },
      error
    } = await supabase.auth.signInWithPassword({
      email: form.data.email,
      password: form.data.password
    });

    if (error) return fail(401, { form, msg: error.message });

    if (!user) redirect(303, '/?error=no-session');

    if (user.user_metadata.role === 'teacher') {
      //speed run logging haha
      await supabase.from('login_logs_tb').insert({
        user_id: user.id,
        direction: 'logged in'
      });
    }

    return { form, msg: `Welcome back, ${user?.user_metadata.firstname}!` };
  },

  registerEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(registerSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const {
      data: { user },
      error
    } = await supabase.auth.signUp({
      email: form.data.email,
      password: form.data.password,
      options: {
        data: {
          role: 'teacher',
          email: form.data.email,
          firstname: form.data.firstName,
          middlename: form.data.middleName,
          lastname: form.data.lastName,
          teacher_id: form.data.teacherId,
          phone: form.data.phone,
          department_id: form.data.department_id
        }
      }
    });

    if (!user) redirect(303, '/?error=something-went-wrong');

    if (error) return fail(401, { form, msg: error.message });
    //speed run logging haha
    await supabase.from('login_logs_tb').insert({
      user_id: user.id,
      direction: 'registered'
    });
    return { form, msg: 'Account created successfully.' };
  },

  forgotPwdEvent: async ({ request, locals: { supabase }, url }) => {
    const form = await superValidate(request, zod(forgotPwdSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabase.auth.resetPasswordForEmail(form.data.email, {
      redirectTo: `${url.pathname}/hello`
    });

    if (error) return fail(401, { form, msg: error.message });

    return { form, msg: 'Check your email for a link to reset your password.' };
  }
};
