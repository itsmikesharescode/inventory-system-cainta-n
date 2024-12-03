import { z } from 'zod';

export const updateEmailSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' })
});

export type UpdateEmailSchema = typeof updateEmailSchema;
