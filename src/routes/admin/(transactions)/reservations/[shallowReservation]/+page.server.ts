import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { PageServerLoad } from './$types';
import type { AdminLayout } from '$lib/types/admin/adminLayout.types';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
  return {
    specificReservation: (await supabase
      .from('reservations_tb')
      .select('*')
      .eq('id', url.pathname.split('/')[3])
      .limit(1)
      .single()) as PostgrestSingleResponse<AdminLayout['reservations'][number]>
  };
};
