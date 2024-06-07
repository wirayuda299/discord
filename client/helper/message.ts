import { toast } from 'sonner';

import { ApiRequest } from '@/utils/api';
import { revalidate } from '@/utils/cache';
import { createError } from '@/utils/error';
import { deleteImage } from './file';

const api = new ApiRequest();

export type PinnedMessageType = {
  message_id: string;
  channel_id: string;
  message: string;
  image: string;
  pinned_by: string;
  username: string;
  avatar: string;
  created_at: string;
};

export async function getPinnedMessages(
  channelId: string,
  serverId: string,
): Promise<PinnedMessageType[]> {
  try {
    const messages = await api.getData<PinnedMessageType[]>(
      `/messages/pinned-messages?channelId=${channelId}&serverId=${serverId}`,
    );

    return messages;
  } catch (error) {
    throw error;
  }
}

export async function getPersonalPinnedMessages(
  conversationId: string,
): Promise<PinnedMessageType[]> {
  try {
    if (!conversationId) return [];

    const messages = await api.getData<PinnedMessageType[]>(
      `/messages/personal-pinned-messages?conversationId=${conversationId}`,
    );

    return messages;
  } catch (error) {
    throw error;
  }
}

export async function getMessageInChannel(channelId: string, serverId: string) {
  try {
    const messages = await api.getData(
      `/messages/message-channel?channel_id=${channelId}&server_id=${serverId}`,
    );

    return messages;
  } catch (error) {
    throw error;
  }
}

export async function editMessage(
  messageAuthor: string,
  currentUser: string,
  messageId: string,
  content: string,
) {
  try {
    await api.update(
      '/messages/edit-message',
      { messageAuthor, currentUser, messageId, content },
      'PATCH',
    );
  } catch (error) {
    throw error;
  }
}

export async function deletePersonalPinnedMessage(id: string, path: string) {
  try {
    await api
      .update(
        '/messages/delete-personal-pinned-message',
        { messageId: id },
        'DELETE',
      )
      .then(() => {
        toast.success('Pinned message deleted');
      });
    revalidate(path);
  } catch (error) {
    throw error;
  }
}

export async function deleteChannelPinnedMessage(
  id: string,
  channelId: string,
  path: string,
) {
  try {
    await api
      .update(
        '/messages/delete-channel-pinned-message',
        { messageId: id, channelId },
        'DELETE',
      )
      .then(() => {
        toast.success('Pinned message deleted');
      });
    revalidate(path);
  } catch (error) {
    throw error;
  }
}

export async function deleteMessage(id: string, media_asset_id?: string) {
  try {
    if (media_asset_id) {
      await deleteImage(media_asset_id);
    }

    return await api
      .update('/messages/delete', { messageId: id }, 'DELETE')
      .then(() => toast.success('Message deleted'));
  } catch (error) {
    createError(error);
    throw error;
  }
}
