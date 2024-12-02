import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/database.types';

export const streamItems = async (supabase: SupabaseClient<Database>) => {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('items_tb')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return null;
  return data;
};
