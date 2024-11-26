import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({
  locals: { safeGetSession, supabaseAdmin },
  cookies
}) => {
  const { session } = await safeGetSession();

  /* const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    '8a00ca74-6a77-4083-9751-a421771f48e8',
    {
      user_metadata: {
        role: 'admin',
        email: 'localadmin@gmail.com',
        firstName: 'Super',
        middleName: 'Doowper',
        lastName: 'Admin'
      }
    }
  );

  console.log(data, error?.message); */

  return {
    session,
    cookies: cookies.getAll()
  };
};
