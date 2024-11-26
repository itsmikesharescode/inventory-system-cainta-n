import { z } from 'zod';

export const forgotPwdSchema = z.object({
  email: z.string().email({ message: 'Must enter a valid email.' })
});

export type ForgotPwdSchema = typeof forgotPwdSchema;
