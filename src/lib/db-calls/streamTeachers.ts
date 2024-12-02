import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/database.types';

const streamTeachers = async (supabase: SupabaseClient<Database>) => {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('teachers_tb')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return null;

  return data;
};

export default streamTeachers;
