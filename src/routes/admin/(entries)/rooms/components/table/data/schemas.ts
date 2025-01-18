import { z } from 'zod';

export const roomSchema = z.object({
  id: z.number(),
  name: z.string(),
  number: z.number()
});

export type RoomsPageTable = z.output<typeof roomSchema>;
