import { z } from 'zod';

export const createChannelSchema = z.object({
  channelType: z.enum(['text', 'audio']),
  name: z.string().min(4),
});

export const createServerSchema = z.object({
  name: z
    .string()
    .min(4, 'Min character is 4')
    .max(25, 'Max character for server name is 25'),
  logo: z.string().min(10),
});

export const updateServerSchema = z.object({
  name: z.string().min(3).max(50),
  logo: z.string(),
  showProgressBar: z.boolean(),
  showBanner: z.boolean(),
  banner: z.string().optional().nullable(),
});

export type CreateChannelSchemaType = z.infer<typeof createChannelSchema>;
export type CreateServerSchemaType = z.infer<typeof createServerSchema>;
export type UpdateServerSchemaType = z.infer<typeof updateServerSchema>;
