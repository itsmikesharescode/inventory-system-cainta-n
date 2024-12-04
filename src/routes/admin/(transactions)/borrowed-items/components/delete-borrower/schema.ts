import { z } from 'zod';

export const deleteReservationSchema = z.object({
  id: z.number()
});

export type DeleteReservationSchema = typeof deleteReservationSchema;
