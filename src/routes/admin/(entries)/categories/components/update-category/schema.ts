import { z } from 'zod';

export const updateCategorySchema = z.object({
  id: z.number(),
  name: z.string().min(1, { message: 'Name is required' })
});

export type UpdateCategorySchema = typeof updateCategorySchema;
