import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { PageServerLoad } from './$types';
import type { AdminLayout } from '$lib/types/admin/adminLayout.types';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
  const { data, error } = await supabase
    .from('borrowed_items_tb')
    .select('*')
    .eq('id', url.pathname.split('/')[3])
    .limit(1)
    .single();
  console.log(data, error?.message);

  return {
    specificReturnedItem: (await supabase
      .from('returned_items_tb')
      .select('*')
      .eq('id', url.pathname.split('/')[3])
      .limit(1)
      .single()) as PostgrestSingleResponse<AdminLayout['returned_items'][number]>
  };
};
