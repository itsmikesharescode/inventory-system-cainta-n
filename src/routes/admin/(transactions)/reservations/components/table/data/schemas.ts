import type { Database } from '$lib/database.types';
import type { UserMetaData } from '$lib/types';
import { z } from 'zod';

export const reservationSchema = z.object({
  user_id: z.string(),
  item_id: z.number(),
  fullname: z.string(),
  quantity: z.number(),
  room: z.string(),
  date: z.string(),
  time: z.string(),
  item: z.string(),
  user_meta_data: z.custom<UserMetaData>().nullable(),
  items_tb: z.custom<Database['public']['Tables']['items_tb']['Row']>().nullable()
});

export type ReservationsPageTable = z.output<typeof reservationSchema>;
