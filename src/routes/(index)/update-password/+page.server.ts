import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { updatePasswordSchema } from './schema';
import { fail, redirect } from '@sveltejs/kit';
import type { EmailOtpType } from '@supabase/supabase-js';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
  const token_hash = url.searchParams.get('token_hash') as string;
  const type = url.searchParams.get('type') as EmailOtpType | null;
  const next = url.searchParams.get('next') ?? '/';

  const redirectTo = new URL(url);
  redirectTo.pathname = next;
  redirectTo.searchParams.delete('token_hash');
  redirectTo.searchParams.delete('type');

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) {
      /* redirectTo.searchParams.delete('next');
      redirect(303, redirectTo); */

      return {
        updatePasswordForm: await superValidate(zod(updatePasswordSchema))
      };
    }
  }

  redirect(303, '/?error=no-token');
};

export const actions: Actions = {
  updatePasswordEvent: async ({ locals: { supabase }, request }) => {
    const form = await superValidate(request, zod(updatePasswordSchema));

    if (!form.valid) return fail(400, { form });

    const { error } = await supabase.auth.updateUser({
      password: form.data.password
    });

    if (error) return fail(401, { form, msg: error.message });
    return { form, msg: 'Password updated.' };
  }
};
