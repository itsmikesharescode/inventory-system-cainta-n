import { z } from 'zod';

export const deleteItemSchema = z.object({
  id: z.number()
});

export type DeleteItemSchema = typeof deleteItemSchema;
