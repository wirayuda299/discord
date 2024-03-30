import { z } from 'zod';

export const createUserSchema = z.object({
  id: z.string().min(10),
  name: z.string().min(3).max(100),
  image: z.string().min(20),
  email: z.string().min(5),
});

export const idSchema = z.string().min(10);
export type userSchemaType = z.infer<typeof createUserSchema>;
