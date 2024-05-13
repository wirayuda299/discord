import { getCookies } from "./cookies";
type Friend = {
  user_id: string;
  username: string;
  image: string;
  created_at: string;
};

const prepareHeaders = async () => {
  return {
    "content-type": "application/json",
    Cookie: await getCookies(),
  };
};

export async function getFriendList(userId: string): Promise<Friend[]> {
  try {
    const res = await fetch(
      `${process.env.SERVER_URL}/friends/list?userId=${userId}`,
      {
        method: "GET",
        credentials: "include",
        headers: await prepareHeaders(),
      },
    );
    const list = await res.json();
    return list.data;
  } catch (error) {
    throw error;
  }
}
