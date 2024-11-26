import type { PageServerLoad } from './$types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { AdminLayout } from '$lib/types/admin/adminLayout.types';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
  return {
    specificItem: (await supabase
      .from('items_tb')
      .select('*')
      .eq('id', url.pathname.split('/')[3])
      .limit(1)
      .single()) as PostgrestSingleResponse<AdminLayout['items'][number]>
  };
};
