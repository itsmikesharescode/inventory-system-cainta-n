import type { Database } from '$lib/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

const streamBorrowersUsersItems = async (
	supabase: SupabaseClient<Database>,
	user_id: string | undefined = undefined
) => {
	if (!supabase) return null;
	if (user_id) {
		const { data, error } = await supabase
			.from('borrowed_items_tb')
			.select('*, teachers_tb("user_meta_data"), items_tb(*),rooms_tb(*)')
			.eq('user_id', user_id)
			.order('created_at', { ascending: false });

		if (error) return null;

		return data;
	} else {
		const { data, error } = await supabase
			.from('borrowed_items_tb')
			.select('*, teachers_tb("user_meta_data"), items_tb(*),rooms_tb(*)')
			.order('created_at', { ascending: false });

		if (error) return null;

		return data;
	}
};

export default streamBorrowersUsersItems;
