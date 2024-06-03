import { ApiRequest } from '@/utils/api';

const api = new ApiRequest();
export type AllThread = {
  thread_id: string;
  message_id: string;
  author: string;
  thread_name: string;
  username: string;
  avatar: string;
  channel_id: string;
  created_at: string;
};

export async function getAllThreads(
  channelId: string,
  serverId: string,
): Promise<AllThread[]> {
  try {
    return await api.getData(
      `/threads?channelId=${channelId}&serverId=${serverId}`,
    );
  } catch (error) {
    throw error;
  }
}
