import { z } from 'zod';

export const disposeReturneeSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  item_id: z.number(),
  room_id: z.number(),
  reference_id: z.string(),
  quantity: z.number().min(1, 'Quantity is required'),
  remarks: z.string().min(4, 'Remarks is required'),
  borrowed_date: z.string()
});

export type DisposeReturneeSchema = typeof disposeReturneeSchema;
