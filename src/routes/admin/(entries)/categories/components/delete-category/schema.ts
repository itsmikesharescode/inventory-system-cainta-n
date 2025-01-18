import { z } from 'zod';

export const deleteCategorySchema = z.object({
  id: z.number()
});

export type DeleteCategorySchema = typeof deleteCategorySchema;
