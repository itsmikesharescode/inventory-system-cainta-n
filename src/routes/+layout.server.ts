import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({
  locals: { safeGetSession, supabaseAdmin },
  cookies
}) => {
  const { session } = await safeGetSession();

  /* const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    '05f2a2e9-ef93-45dd-b23d-c2b5782c6294',
    {
      password: 'admin123',
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
