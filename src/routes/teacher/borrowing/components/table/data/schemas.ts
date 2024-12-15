import type { Database } from '$lib/database.types';
import { z } from 'zod';

export const borrowerSchema = z.object({
	id: z.number(),
	created_at: z.string(),
	reference_id: z.string(),
	returned_date_time: z.string(),
	item_id: z.number(),
	quantity: z.number(),
	room_id: z.number(),
	room: z.string(),
	date: z.string(),
	time: z.string(),
	item: z.string(),
	items_tb: z.custom<Database['public']['Tables']['items_tb']['Row']>().nullable()
});

export type BorrowedItemsPageTable = z.output<typeof borrowerSchema>;
