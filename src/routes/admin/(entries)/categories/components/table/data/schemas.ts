import { z } from 'zod';

export const categorySchema = z.object({
  id: z.number(),
  name: z.string()
});

export type CategoriesPageTable = z.output<typeof categorySchema>;
