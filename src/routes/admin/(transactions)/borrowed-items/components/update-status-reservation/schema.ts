import { z } from 'zod';

export const updateStatusReservationSchema = z.object({
  id: z.number(),
  status: z.string()
});

export type UpdateStatusReservationSchema = typeof updateStatusReservationSchema;
