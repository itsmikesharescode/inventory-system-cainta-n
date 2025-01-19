import { z } from 'zod';

export const returneeSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  user_id: z.string(),
  teacher_id: z.string(),
  room_id: z.number(),
  item_id: z.number(),
  item_name: z.string(),
  quantity: z.number(),
  reference_id: z.string(),
  room_name: z.string(),
  remarks: z.string(),
  teachers_tb: z.any(),
  fullname: z.string(),
  date_borrowed: z.string(),
  date_returned: z.string()
});

export type ReturneePageTable = z.output<typeof returneeSchema>;
