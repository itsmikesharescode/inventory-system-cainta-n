import { z } from 'zod';

export const departmentSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string()
});

export type DepartmentsPageTable = z.output<typeof departmentSchema>;
