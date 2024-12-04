import { z } from 'zod';

export const deleteBorrowerSchema = z.object({
  id: z.number()
});

export type DeleteBorrowerSchema = typeof deleteBorrowerSchema;
