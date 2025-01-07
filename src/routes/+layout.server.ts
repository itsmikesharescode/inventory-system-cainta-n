import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({
  locals: { safeGetSession, supabaseAdmin },
  cookies
}) => {
  const { session } = await safeGetSession();

  /* const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    '0ac3454c-dd7a-4692-be5e-eb65be446593',
    {
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
