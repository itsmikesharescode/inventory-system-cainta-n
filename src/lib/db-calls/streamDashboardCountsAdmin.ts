import type { Database } from '$lib/database.types';
import type { PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js';

type DashboardCount = {
  date: string;
  count: number;
};

type AdminDashboardCounts = {
  approved: DashboardCount[];
  pendings: DashboardCount[];
  rejected: DashboardCount[];
  reservations: DashboardCount[];
};

const streamDashboardCountsAdmin = async (supabase: SupabaseClient<Database>) => {
  if (!supabase) return null;
  const { data, error } = (await supabase.rpc(
    'admin_dashboard_counts'
  )) as PostgrestSingleResponse<AdminDashboardCounts>;

  if (error) return null;

  return data;
};

export default streamDashboardCountsAdmin;
