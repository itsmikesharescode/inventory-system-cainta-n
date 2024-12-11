import { z } from 'zod';

export const updateStatusReservationSchema = z.object({
  id: z.number(),
  status: z.string(),
  item_id: z.number()
});

export type UpdateStatusReservationSchema = typeof updateStatusReservationSchema;
