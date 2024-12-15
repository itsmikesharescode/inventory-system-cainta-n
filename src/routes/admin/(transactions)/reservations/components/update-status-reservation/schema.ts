import { z } from 'zod';

export const updateStatusReservationSchema = z.object({
  reservation_id_client: z.number(),
  item_id_param_client: z.number(),
  status_client: z.string(),
  user_id_client: z.string(),
  date_client: z.string(),
  time_client: z.string(),
  reference_id_client: z.string(),
  room_id_client: z.number(),
  quantity_client: z.number()
});

export type UpdateStatusReservationSchema = typeof updateStatusReservationSchema;
