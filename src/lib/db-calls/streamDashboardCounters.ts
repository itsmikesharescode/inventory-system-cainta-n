import type { Database } from '$lib/database.types';
import type { PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js';

const streamDashboardCounters = async (supabase: SupabaseClient<Database>) => {
  if (!supabase) return null;

  const { data, error } = (await supabase.rpc(
    'admin_dashboard_counters'
  )) as PostgrestSingleResponse<{
    pendings: number;
    approved: number;
    rejected: number;
    accounts: number;
  }>;

  if (error) return null;

  return data;
};

export default streamDashboardCounters;
