import { z } from 'zod';

export const updateDepartmentSchema = z.object({
  id: z.number(),
  name: z.string().min(1, { message: 'Name is required' }),
  code: z.string().min(1, { message: 'Code is required' })
});

export type UpdateDepartmentSchema = typeof updateDepartmentSchema;
