import { z } from 'zod';

export const serverSchema = z.object({
  name: z.string().min(3),
  logo: z.string().min(10),
  userId: z.string().min(10),
});

export const sendMessageSchema = z.object({
  id_channels: z.string().min(10),
  content: z.string().min(1),
  userId: z.string().min(10),
  messageId: z.string().min(10),
});
export const joinChannelSchema = z.object({
  channelId: z.string().min(10),
  userId: z.string().min(10),
});

export const idSchema = z.string().min(10);
export type serverSchemaType = z.infer<typeof serverSchema>;
