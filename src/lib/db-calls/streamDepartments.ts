import type { Database } from '$lib/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

const streamDepartments = async (supabase: SupabaseClient<Database>) => {
  if (!supabase) return null;

  const { data, error } = await supabase.from('departments_tb').select('*');

  if (error) return null;

  return data;
};

export default streamDepartments;
