import { z } from 'zod';

export const deleteRoomSchema = z.object({
  id: z.number()
});

export type DeleteRoomSchema = typeof deleteRoomSchema;
