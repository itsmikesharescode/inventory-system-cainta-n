import { z } from 'zod';

export const moveToReturneeSchema = z.object({
  user_id: z.string(),
  item_id: z.number(),
  room_id: z.number(),
  quantity: z.number(),
  reference_id: z.string(),
  remarks: z.string().min(3, { message: 'Remarks must be at least 3 characters' }),
  borrowed_date: z.string()
});

export type MoveToReturneeSchema = typeof moveToReturneeSchema;
