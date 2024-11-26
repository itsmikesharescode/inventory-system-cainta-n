import { z } from 'zod';

export const addBorrowerSchema = z.object({
  teacherId: z.string().min(1, { message: 'Must enter teacher id.' }),
  borrowerName: z.string().min(1, { message: 'Must enter borrower name.' }),
  borrowedDate: z.string().min(1, { message: 'Must enter borrowed date.' }),
  itemsBorrowed: z.array(z.any()).min(1, { message: 'Must borrow at least one item.' }),
  room: z.string().min(1, { message: 'Must enter room.' })
});

export type AddBorrowerSchema = typeof addBorrowerSchema;
