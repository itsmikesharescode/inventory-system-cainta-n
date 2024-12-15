import type { Database } from '$lib/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

const streamReturnedItemUser = async (supabase: SupabaseClient<Database>) => {
  if (!supabase) return null;

  const { data, error } = await supabase.from('returned_items_tb').select('*, teachers_tb(*)');
  console.log(data);
  if (error) return null;
  return data;
};

export default streamReturnedItemUser;
