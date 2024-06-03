'use server';

import { revalidatePath } from 'next/cache';

import { ApiRequest } from '@/utils/api';

const api = new ApiRequest();

export async function pinMessage(
  channelId: string,
  msgId: string,
  pinnedBy: string,
  path: string,
) {
  try {
    await api.update(
      '/messages/pin-message',
      {
        channelId,
        messageId: msgId,
        pinnedBy,
      },
      'POST',
    );
    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}

export async function pinPersonalMessage(
  conversationId: string,
  messageId: string,
  pinnedBy: string,
  path: string,
) {
  try {
    await api.update(
      '/messages/pin-personal-message',
      {
        conversationId,
        messageId,
        pinnedBy,
      },
      'POST',
    );
    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}
