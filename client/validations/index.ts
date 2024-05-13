import { z } from "zod";

export const chatSchema = z.object({
  author_id: z.string().min(10),
  channel_id: z.string().min(10),
  message: z.string().min(1),
  image: z.string().optional(),
});

export const createChannelSchema = z.object({
  channelType: z.enum(["text", "audio"]),
  name: z.string().min(4),
});

export const createServerSchema = z.object({
  name: z.string(),
  logo: z.string(),
});

export const updateServerSchema = z.object({
  name: z.string().min(3).max(50),
  logo: z.string(),
});

export const createThreadSchema = z.object({
  threadName: z.string().min(4).max(20),
  author_id: z.string(),
  channel_id: z.string(),
  message: z.string().min(1),
  image: z.string(),
});

export type CreateThreadSchemaTypes = z.infer<typeof createThreadSchema>;
export type CreateChannelSchemaType = z.infer<typeof createChannelSchema>;
export type CreateServerSchemaType = z.infer<typeof createServerSchema>;
export type UpdateServerSchemaType = z.infer<typeof updateServerSchema>;
export type ChatSchema = z.infer<typeof chatSchema>;
