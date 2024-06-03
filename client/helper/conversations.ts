import { Conversation } from '@/types/messages';
import { ApiRequest } from '@/utils/api';

const api = new ApiRequest();

export async function getConversationList(
  userId: string,
): Promise<Conversation[]> {
  try {
    if (!userId) return [];

    const result = await api.getData<Conversation[]>(
      `/conversations/list?userId=${userId}`,
    );
    return result;
  } catch (error) {
    throw error;
  }
}
