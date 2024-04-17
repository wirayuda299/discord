import { z } from 'zod';

export const chatSchema = z.object({
	author_id: z.string().min(10),
	channel_id: z.string().min(10),
	message: z.string().min(1),
	image: z.string().optional(),
});
export type ChatSchema = z.infer<typeof chatSchema>;

export const createChannelSchema = z.object({
	channelType: z.enum(['text', 'audio']),
	name: z.string().min(4),
});
export type CreateChannelSchemaType = z.infer<typeof createChannelSchema>;

export const createServerSchema = z.object({
	name: z.string(),
	logo: z.string(),
});

export type CreateServerSchemaType = z.infer<typeof createServerSchema>;

export const updateServerSchema = z.object({
	name: z.string().min(3).max(50),
	logo: z.string(),
});
export type UpdateServerSchemaType = z.infer<typeof updateServerSchema>;
