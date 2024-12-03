import type { Database } from '$lib/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

const streamReservationsItems = async (supabase: SupabaseClient<Database>, user_id: string) => {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('reservations_tb')
    .select('*,items_tb(*)')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });

  if (error) return null;
  return data;
};

export default streamReservationsItems;
