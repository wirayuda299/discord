import { Thread } from "@/types/messages";
import { prepareHeaders } from "./cookies";

const serverUrl = process.env.SERVER_URL;

export async function getAllThreads(
  channelId: string,
  serverId: string,
): Promise<Thread[]> {
  
  try {
    const res = await fetch(
      `${serverUrl}/threads?channelId=${channelId}&serverId=${serverId}`,
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
