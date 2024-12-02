import { z } from 'zod';

export const accountSchema = z.object({
  user_id: z.string(),
  created_at: z.string(),
  teacher_id: z.string(),
  fullname: z.string(),
  firstname: z.string(),
  middlename: z.string(),
  lastname: z.string(),
  email: z.string(),
  phone: z.string(),
  department: z.string()
});

export type AccountsPageTable = z.output<typeof accountSchema>;
