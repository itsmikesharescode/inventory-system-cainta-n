import { z } from 'zod';

export const addReturneeSchema = z.object({
  borrowed_item_id: z.string().min(1, { message: 'Teacher is required' }),
  returned_date: z.string().min(1, { message: 'Date is required' }),
  time: z.string().min(1, { message: 'Time is required' }),
  remarks: z.string().min(1, { message: 'Remarks is required' })
});

export type AddReturneeSchema = typeof addReturneeSchema;
