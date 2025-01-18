import { z } from 'zod';

export const updateRoomSchema = z.object({
  id: z.number(),
  name: z.string().min(1, { message: 'Name is required' }),
  number: z.number().min(1, { message: 'Number is required' })
});

export type UpdateRoomSchema = typeof updateRoomSchema;
