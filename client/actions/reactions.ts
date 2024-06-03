'use server';

import { ApiRequest } from '@/utils/api';
import { revalidatePath } from 'next/cache';

const api = new ApiRequest();

export async function addOrRemoveReaction(
  messageId: string,
  emoji: string,
  unifiedEmoji: string,
  userId: string,
) {
  try {
    await api.update(
      '/reactions/add-or-remove',
      {
        message_id: messageId,
        emoji,
        unified_emoji: unifiedEmoji,
        react_by: userId,
      },
      'POST',
    );
  } catch (error) {
    throw error;
  }
}
