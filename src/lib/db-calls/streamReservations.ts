import type { Database } from '$lib/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

const streamReservations = async (supabase: SupabaseClient<Database>) => {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('reservations_tb')
    .select('*,teachers_tb("user_meta_data"), items_tb(*)')
    .order('created_at', { ascending: false });
  console.log(data, error?.message);
  if (error) return null;
  return data;
};

export default streamReservations;
