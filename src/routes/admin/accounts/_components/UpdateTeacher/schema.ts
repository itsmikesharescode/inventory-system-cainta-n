import { z } from 'zod';

export const updateTeacherSchema = z
  .object({
    userId: z.string(),
    fName: z.string().min(1, { message: 'Must enter a first name.' }),
    mName: z.string().min(1, { message: 'Must enter a middle name.' }),
    lName: z.string().min(1, { message: 'Must enter a last name.' }),
    teacherId: z.string().min(3, { message: 'Must enter a valid teacher id.' }),
    phone: z.string().min(5, { message: 'Must enter a phone number.' }),
    department: z.string().min(1, { message: 'Must enter department.' }),
    email: z.string().email({ message: 'Must enter a valid email.' }),
    pwd: z.string().min(8, { message: 'Must choose a strong password.' }),
    confirmPwd: z.string()
  })
  .superRefine(({ pwd, confirmPwd }, ctx) => {
    if (pwd !== confirmPwd) {
      ctx.addIssue({
        code: 'custom',
        message: 'Must confirm password.',
        path: ['confirmPwd']
      });
    }
  });

export type UpdateTeacherSchema = typeof updateTeacherSchema;
