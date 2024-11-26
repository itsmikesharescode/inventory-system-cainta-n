import { z } from 'zod';

export const registerSchema = z
  .object({
    teacherId: z.string().min(6, { message: 'Must enter a valid teacher id.' }),
    firstName: z.string().min(1, { message: 'Must enter a first name.' }),
    middleName: z.string().min(1, { message: 'Must enter a middle name.' }),
    lastName: z.string().min(1, { message: 'Must enter a last name.' }),
    phone: z.string().min(5, { message: 'Must enter a phone number.' }),
    department: z.string().min(1, { message: 'Must enter department.' }),
    email: z.string().email({ message: 'Must enter a valid email.' }),
    password: z.string().min(8, { message: 'Must choose a strong password.' }),
    confirmPassword: z.string()
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Must confirm password.',
        path: ['confirmPassword']
      });
    }
  });

export type RegisterSchema = typeof registerSchema;
