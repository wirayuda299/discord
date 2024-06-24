import { ApiRequest } from '@/utils/api';
import { revalidate } from '@/utils/cache';
import { createError } from '@/utils/error';
import { toast } from 'sonner';

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

export async function updateThread(serverId: string, userId: string, threadId: string, threadName: string, pathname: string) {
  try {
    if (!userId) {
      toast.error("Unauthorized")
      return
    }
    if (!threadName) {
      toast.error("Thread name is required")
      return
    }
    if (!threadId) {
      toast.error("Thread ID is required")
      return
    }
    await api.update('/threads/update', {
      serverId, userId, threadId, threadName
    }, "PUT").then(() => {

      toast.success("Thread has been updated")
      revalidate(pathname)
    })
  } catch (error) {
    createError(error)
  }
}
