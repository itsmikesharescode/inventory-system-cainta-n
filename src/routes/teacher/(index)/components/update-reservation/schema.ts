import { z } from 'zod';

export const updateReservationSchema = z.object({
  id: z.number(),
  item_id: z.number().min(1, { message: 'Item is required' }),
  quantity: z.number().min(1, { message: 'Quantity is required' }),
  room_id: z.number().min(1, { message: 'Room is required' }),
  date: z.string().min(1, { message: 'Date is required' }),
  time: z.string().min(1, { message: 'Time is required' })
});

export type UpdateReservationSchema = typeof updateReservationSchema;
