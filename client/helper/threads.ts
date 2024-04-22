import { getCookies } from "./cookies";

const serverUrl = process.env.SERVER_URL;

const prepareHeaders = async () => {
  return {
    "content-type": "application/json",
    Cookie: await getCookies(),
  };
};

export async function getAllThreads(channelId: string, serverId: string) {
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
