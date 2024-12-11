import { z } from 'zod';

export const addRoomSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  number: z.number().min(1, { message: 'Number is required' })
});

export type AddRoomSchema = typeof addRoomSchema;
