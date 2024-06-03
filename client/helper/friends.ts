import { ApiRequest } from '@/utils/api';

const api = new ApiRequest();

export type Friend = {
  conversation: {
    conversationCreatedAt: string;
    conversationId: string;
    friendCreatedAt: string;
    friendId: string;
    friendImage: string;
    friendUsername: string;
    id: string;
  };
  id: string;
  created_at: string;
  user_id: string;
  username: string;
  image: string;
};

export async function getFriendList(userId: string): Promise<Friend[]> {
  try {
    const res = await api.getData<Friend[]>(`/friends/list?userId=${userId}`);

    return res;
  } catch (error) {
    throw error;
  }
}
export async function getFriend(
  friendId: string,
  userId: string,
): Promise<Friend | undefined> {
  try {
    if (!userId) return;

    const res = await api.getData<Friend>(
      `/friends?friendId=${friendId}&userId=${userId}`,
    );
    return res;
  } catch (error) {
    throw error;
  }
}
