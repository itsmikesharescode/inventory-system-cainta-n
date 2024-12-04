import { z } from 'zod';

export const deleteReturneeSchema = z.object({
  id: z.number()
});

export type DeleteReturneeSchema = typeof deleteReturneeSchema;
