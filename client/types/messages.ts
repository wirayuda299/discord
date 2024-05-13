export type Thread = {
  username: string;
  author_id: string;
  thread_name: string;
  thread_id: string;
  channel_id: string;
  message: string;
  is_read: boolean;
  author: string;
  media_image: string;
  message_type: string;
  media_image_asset_id: string;
  created_at: string;
  update_at: string;
};

export interface Message {
  message_id: string;
  message: string;
  is_read: boolean;
  author: string;
  media_image: string;
  message_type: string;
  media_image_asset_id: string;
  created_at: string;
  update_at: string;
  username: string;
  shouldAddLabel: boolean;
  parent_message_id: string;
  threads: Thread[];
  reactions: {
    emoji: string;
    unified_emoji: string;
    count: number;
  }[];
  reply_id?: string;
  thread_name?: string;
}

export interface MessageData {
  content: string;
  is_read: boolean;
  user_id: string | undefined;
  username: string | undefined;
  channel_id: string;
  server_id: string;
  image_url: string;
  image_asset_id: string;
  avatar: string | undefined;
  type: string;
  parentMessageId: string;
  messageId?: string;
}

export interface Conversation {
  created_at: string;
  conversation_id: string;
  message_id: string;
  recipient_id: string;
  sender_id: string;
  username: string;
  image: string;
}
