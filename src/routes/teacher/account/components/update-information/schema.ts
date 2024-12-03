import { z } from 'zod';

export const updateInformationSchema = z.object({
  firstName: z.string().min(1, { message: 'Must enter a first name.' }),
  middleName: z.string().min(1, { message: 'Must enter a middle name.' }),
  lastName: z.string().min(1, { message: 'Must enter a last name.' }),
  phone: z.string().min(5, { message: 'Must enter a phone number.' }),
  department: z.string().min(1, { message: 'Must enter department.' })
});

export type UpdateInformationSchema = typeof updateInformationSchema;
