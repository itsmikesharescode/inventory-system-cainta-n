import type { PageServerLoad } from './$types';
import streamDashboardCountsAdmin from '$lib/db-calls/streamDashboardCountsAdmin';
import streamDashboardCounters from '$lib/db-calls/streamDashboardCounters';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	return {
		dashboardCounts: streamDashboardCountsAdmin(supabase),
		dashboardCounters: streamDashboardCounters(supabase)
	};
};
