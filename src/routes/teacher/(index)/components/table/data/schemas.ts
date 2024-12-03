import type { Database } from '$lib/database.types';
import type { UserMetaData } from '$lib/types';
import { z } from 'zod';

export const reservationSchema = z.object({
  id: z.number(),
  reference_id: z.string(),
  created_at: z.string(),
  item_id: z.number(),
  room: z.string(),
  status: z.string(),
  quantity: z.number(),
  date: z.string(),
  time: z.string(),
  item: z.string(),
  when: z.string().nullable()
});

export type ReservationsPageTable = z.output<typeof reservationSchema>;
