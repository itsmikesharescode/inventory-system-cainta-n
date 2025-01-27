import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({
  locals: { safeGetSession, supabaseAdmin },
  cookies
}) => {
  const { session } = await safeGetSession();

  /* const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    '96cd6d83-a568-4206-b975-f0f48616811a',
    {
      user_metadata: {
        role: 'admin',
        email: 'admin@gmail.com',
        firstname: 'Admin',
        middlename: '',
        lastname: 'Super'
      }
    }
  );

  console.log(data, error?.message); */

  return {
    session,
    cookies: cookies.getAll()
  };
};
