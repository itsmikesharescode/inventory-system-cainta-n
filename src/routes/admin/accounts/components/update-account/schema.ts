import { z } from 'zod';

export const updateAccountSchema = z
  .object({
    user_id: z.string(),
    phone: z.string().min(1, { message: 'Phone is required' }),
    email: z.string().min(1, { message: 'Email is required' }),
    firstname: z.string().min(1, { message: 'First name is required' }),
    middlename: z.string().min(1, { message: 'Middle name is required' }),
    lastname: z.string().min(1, { message: 'Last name is required' }),
    teacher_id: z.string().min(1, { message: 'Teacher ID is required' }),
    department: z.string().min(1, { message: 'Department is required' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/, {
        message:
          'Password must contain at least one uppercase letter, one number, and one special character'
      }),
    confirm_password: z.string().min(1, { message: 'Confirm password is required' })
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ['confirm_password'],
    message: 'Passwords do not match'
  });

export type UpdateAccountSchema = typeof updateAccountSchema;
