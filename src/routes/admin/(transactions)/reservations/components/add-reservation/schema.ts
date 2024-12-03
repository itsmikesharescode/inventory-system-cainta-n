import { z } from 'zod';

export const addReservationSchema = z.object({
  teacher_id: z.string().min(1, { message: 'Teacher ID is required' }),
  max_items: z.number().min(1, { message: 'Max items is required' }),
  room: z.string().min(1, { message: 'Room is required' }),
  date: z.string().min(1, { message: 'Date is required' }),
  time: z.string().min(1, { message: 'Time is required' })
});

export type AddReservationSchema = typeof addReservationSchema;
