import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({
  locals: { safeGetSession, supabaseAdmin },
  cookies,
}) => {
  const { session } = await safeGetSession();

  /* const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    "35deb453-c2ba-49c0-9231-062142d95ced",
    {
      password: "12345678",
      user_metadata: {
        role: "admin",
        email: "admin_ostria@gmail.com",
        firstname: "Charles",
        middlename: "",
        lastname: "Ostria",
      },
    },
  );

  console.log(data, error?.message); */

  return {
    session,
    cookies: cookies.getAll(),
  };
};
