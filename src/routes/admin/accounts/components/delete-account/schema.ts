import { z } from 'zod';

export const deleteAccountSchema = z.object({
  id: z.number()
});

export type DeleteAccountSchema = typeof deleteAccountSchema;
