import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({
  locals: { safeGetSession, supabaseAdmin },
  cookies
}) => {
  const { session } = await safeGetSession();

  /*  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    'f2282acb-78f6-4df3-b9cf-63453064a709',
    {
      password: '12345678',
      user_metadata: {
        role: 'admin',
        email: 'admin_ostria@gmail.com',
        firstname: 'Charles',
        middlename: '',
        lastname: 'Ostria'
      }
    }
  );

  console.log(data, error?.message); */

  return {
    session,
    cookies: cookies.getAll()
  };
};
