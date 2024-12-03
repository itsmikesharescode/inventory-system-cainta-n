import { z } from 'zod';

export const reservationSchema = z.object({
  teacher_id: z.string(),
  fullname: z.string(),
  max_items: z.number(),
  room: z.string(),
  date: z.string(),
  time: z.string()
});

export type ReservationsPageTable = z.output<typeof reservationSchema>;
