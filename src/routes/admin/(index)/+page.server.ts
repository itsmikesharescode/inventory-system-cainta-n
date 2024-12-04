import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { PageServerLoad } from './$types';
import streamDashboardCountsAdmin from '$lib/db-calls/streamDashboardCountsAdmin';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  return {
    dashboardCounts: streamDashboardCountsAdmin(supabase)
  };
};
