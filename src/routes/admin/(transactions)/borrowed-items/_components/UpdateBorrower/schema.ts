import { z } from 'zod';

export const updateBorrowerSchema = z.object({
  id: z.number(),
  borrowerName: z.string().min(1, { message: 'Must enter borrower name.' }),
  borrowedDate: z.string().min(1, { message: 'Must enter borrowed date.' }),
  itemsBorrowed: z.array(z.any()).min(1, { message: 'Must borrow at least one item.' }),
  room: z.string().min(1, { message: 'Must enter room.' })
});

export type UpdateBorrowerSchema = typeof updateBorrowerSchema;
