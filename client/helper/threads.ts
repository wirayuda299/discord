import { prepareHeaders } from "./cookies";

const serverUrl = process.env.SERVER_URL;

type ThreadType = {
  thread_id: string;
  message_id: string;
  author: string;
  thread_name: string;
  channel_id: string;
};


export async function getAllThreads(
  channelId: string,
  serverId: string,
): Promise<ThreadType[]> {
  try {
    const res = await fetch(
      `${serverUrl}/threads/all-threads?channelId=${channelId}&serverId=${serverId}`,
      {
        headers: await prepareHeaders(),
        method: "GET",
        credentials: "include",
      },
    );
    const threads = await res.json();
    return threads.data;
  } catch (error) {
    throw error;
  }
}
