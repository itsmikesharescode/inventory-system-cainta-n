import type { Database } from '$lib/database.types';
import type { UserMetaData } from '$lib/types';
import { z } from 'zod';

export const returneeSchema = z.object({
	id: z.number(),
	created_at: z.string(),
	user_id: z.string(),
	item_name: z.string(),
	quantity: z.number(),
	reference_id: z.string(),
	room_name: z.string(),
	remarks: z.string(),
	teachers_tb: z.any(),
	teacher_id: z.string(),
	fullname: z.string(),
	date_borrowed: z.string(),
	date_returned: z.string()
});

export type ReturneePageTable = z.output<typeof returneeSchema>;
