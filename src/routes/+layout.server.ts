import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({
  locals: { safeGetSession, supabaseAdmin },
  cookies
}) => {
  const { session } = await safeGetSession();

  /*  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    'f357d399-2fa3-49ba-a909-6030fbf48144',
    {
      user_metadata: {
        role: 'admin',
        email: 'localadmin@gmail.com',
        firstname: 'local',
        middlename: '',
        lastname: 'admin'
      }
    }
  );

  console.log(data, error?.message); */

  return {
    session,
    cookies: cookies.getAll()
  };
};
