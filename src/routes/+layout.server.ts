import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({
  locals: { safeGetSession, supabaseAdmin },
  cookies
}) => {
  const { session } = await safeGetSession();

  /*  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    'ce5bcd88-f878-4fff-a5ca-b09ee68d7741',
    {
      user_metadata: {
        role: 'admin',
        email: 'localadmin@gmail.com',
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
