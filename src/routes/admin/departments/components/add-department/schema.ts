import { z } from 'zod';

export const addDepartmentSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  code: z.string().min(1, { message: 'Code is required' })
});

export type AddDepartmentSchema = typeof addDepartmentSchema;
