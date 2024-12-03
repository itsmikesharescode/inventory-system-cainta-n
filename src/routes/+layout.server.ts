import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({
  locals: { safeGetSession, supabaseAdmin },
  cookies
}) => {
  const { session } = await safeGetSession();

  /* const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    'fb9a5747-4411-4ffb-8210-aed5ea0f2e7b',
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
