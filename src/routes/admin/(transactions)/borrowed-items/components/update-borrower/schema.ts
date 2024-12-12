import { z } from 'zod';

export const updateBorrowerSchema = z.object({
	id: z.number(),
	user_id: z.string().min(1, { message: 'Teacher is required' }),
	item_id: z.number().min(1, { message: 'Item is required' }),
	room_id: z.number().min(1, { message: 'Room is required' }),
	date: z.string().min(1, { message: 'Date is required' }),
	time: z.string().min(1, { message: 'Time is required' }),
	quantity: z.number().min(1, { message: 'Quantity is required' })
});

export type UpdateBorrowerSchema = typeof updateBorrowerSchema;
