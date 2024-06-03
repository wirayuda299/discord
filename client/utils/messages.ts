type Props = {
  content: string;
  userId: string;
  imageAssetId: string;
  recipientId?: string;
  imageUrl: string;
  conversationId?: string;
  type: string;
  channelId?: string;
  avatar?: string;
  serverId?: string;
  username?: string;
  messageId?: string;
  parentMessageId?: string;
  threadId?: string;
};

export const messageData = ({
  content,
  conversationId = '',
  imageAssetId,
  imageUrl,
  recipientId = '',
  userId,
  type,
  avatar = '',
  channelId = '',
  messageId = '',
  parentMessageId = '',
  serverId = '',
  username = '',
  threadId = '',
}: Props) => ({
  content: content.trim(),
  is_read: false,
  user_id: userId,
  type,
  imageAssetId,
  imageUrl,
  conversationId,
  recipientId,
  avatar,
  channelId,
  messageId,
  serverId,
  parentMessageId,
  username,
  threadId,
});

import { Message } from '@/types/messages';

export const foundMessage = (messages: Message[], msg: Message) => {
  const messagesMap = new Map(
    messages.map((message) => [message.message_id, message]),
  );
  return messagesMap.get(msg.parent_message_id);
};
