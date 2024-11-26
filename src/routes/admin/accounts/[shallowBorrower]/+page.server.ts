import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { PageServerLoad } from './$types';
import type { AdminLayout } from '$lib/types/admin/adminLayout.types';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
  return {
    specificTeacher: (await supabase
      .from('teachers_tb')
      .select('*')
      .eq('teacher_id', url.pathname.split('/')[3])
      .limit(1)
      .single()) as PostgrestSingleResponse<AdminLayout['teachers'][number]>
  };
};
