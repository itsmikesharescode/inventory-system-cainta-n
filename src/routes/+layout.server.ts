import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({
  locals: { safeGetSession, supabaseAdmin },
  cookies
}) => {
  const { session } = await safeGetSession();

  /* const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
		'5eabd8a7-d32b-4acb-aa77-b28f5884a6a6',
		{
			password: 'admin123',
			user_metadata: {
				role: 'admin',
				email: 'localadmin@gmail.com',
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
