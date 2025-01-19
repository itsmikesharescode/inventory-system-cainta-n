import { z } from 'zod';

export const disposeSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  user_id: z.string(),
  fullname: z.string(),
  item_id: z.number(),
  item_name: z.string(),
  room_id: z.number(),
  room_name: z.string(),
  reference_id: z.string(),
  quantity: z.number(),
  remarks: z.string(),
  borrowed_date: z.string()
});

export type DisposePageTable = z.output<typeof disposeSchema>;
