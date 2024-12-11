import { z } from 'zod';

export const updateReturneeSchema = z.object({
  id: z.number(),
  returned_date: z.string().min(1, { message: 'Date is required' }),
  time: z.string().min(1, { message: 'Time is required' }),
  remarks: z.string().min(1, { message: 'Remarks is required' })
});

export type UpdateReturneeSchema = typeof updateReturneeSchema;
