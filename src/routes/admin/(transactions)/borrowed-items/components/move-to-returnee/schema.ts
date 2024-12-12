import { z } from 'zod';

export const moveToReturneeSchema = z.object({
	user_id: z.string(),
	item_id: z.number(),
	item_name: z.string(),
	quantity: z.number(),
	reference_id: z.string(),
	room_name: z.string(),
	remarks: z.string().min(3, { message: 'Remarks must be at least 3 characters' }),
	borrowed_date: z.string()
});

export type MoveToReturneeSchema = typeof moveToReturneeSchema;
