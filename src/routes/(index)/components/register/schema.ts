import { z } from 'zod';

export const registerSchema = z
  .object({
    teacherId: z.string().min(6, { message: 'Must enter a valid teacher id.' }),
    firstName: z.string().min(1, { message: 'Must enter a first name.' }),
    middleName: z.string().min(1, { message: 'Must enter a middle name.' }),
    lastName: z.string().min(1, { message: 'Must enter a last name.' }),
    phone: z.string().min(5, { message: 'Must enter a phone number.' }),
    department_id: z.number(),
    email: z.string().email({ message: 'Must enter a valid email.' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/, {
        message:
          'Password must contain at least one uppercase letter, one number, and one special character'
      }),
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
