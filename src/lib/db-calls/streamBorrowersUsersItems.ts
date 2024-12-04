import type { Database } from '$lib/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

const streamBorrowersUsersItems = async (supabase: SupabaseClient<Database>) => {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('borrowed_items_tb')
    .select('*, teachers_tb("user_meta_data"), items_tb(*)')
    .order('created_at', { ascending: false });

  if (error) return null;

  return data;
};

export default streamBorrowersUsersItems;
