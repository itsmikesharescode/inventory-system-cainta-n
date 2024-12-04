import type { Database } from '$lib/database.types';
import type { UserMetaData } from '$lib/types';
import { z } from 'zod';

export const returneeSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  reference_id: z.string(),
  teacher_id: z.string(),
  when_borrowed: z.string(),
  when_returned: z.string(),
  user_id: z.string(),
  item_id: z.number(),
  fullname: z.string(),
  room: z.string(),
  item: z.string(),
  user_meta_data: z.custom<UserMetaData>().nullable(),
  items_tb: z.custom<Database['public']['Tables']['items_tb']['Row']>().nullable()
});

export type ReturneePageTable = z.output<typeof returneeSchema>;
