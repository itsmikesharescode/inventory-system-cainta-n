import { z } from 'zod';

export const itemsSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  device_id: z.string().min(1, { message: 'Device ID is required' }),
  department_id: z.number(),
  category_id: z.number(),
  category: z.string().min(1, { message: 'Category is required' }),
  department: z.string(),
  model: z.string().min(1, { message: 'Model is required' }),
  type: z.string().min(1, { message: 'Type is required' }),
  status: z.string().min(1, { message: 'Status is required' }),
  brand: z.string().min(1, { message: 'Brand is required' }),
  quantity: z.number().min(1, { message: 'Quantity is required' }),
  description: z.string().min(1, { message: 'Description is required' })
});

export type ItemsPageTable = z.output<typeof itemsSchema>;
