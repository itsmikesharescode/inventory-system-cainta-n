import { z } from 'zod';

export const deleteDepartmentSchema = z.object({
  id: z.number()
});

export type DeleteDepartmentSchema = typeof deleteDepartmentSchema;
