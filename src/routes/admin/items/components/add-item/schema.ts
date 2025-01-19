import { z } from 'zod';

export const addItemSchema = z.object({
  device_id: z.string().min(1, { message: 'Device ID is required' }),
  department_id: z.number(),
  category_id: z.number(),
  model: z.string().nullable(),
  type: z.string().min(1, { message: 'Type is required' }),
  status: z.string().min(1, { message: 'Status is required' }),
  brand: z.string().min(1, { message: 'Brand is required' }),
  quantity: z.number().min(1, { message: 'Quantity is required' }),
  description: z.string().min(1, { message: 'Description is required' })
});

export type AddItemSchema = typeof addItemSchema;
