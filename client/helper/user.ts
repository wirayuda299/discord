import { User, UserInvite } from "@/types/user";
import { getCookies } from "./cookies";

const serverUrl = process.env.SERVER_URL;

const prepareHeaders = async () => {
  return {
    "content-type": "application/json",
    Cookie: await getCookies(),
  };
};

export async function deleteUser(id: string) {
  try {
    await fetch(`${serverUrl}/user/delete`, {
      method: "DELETE",
      credentials: "include",
      headers: await prepareHeaders(),
      body: JSON.stringify({
        id,
      }),
    });
  } catch (error) {
    throw error;
  }
}

export async function updateUser(
  name: string,
  bio: string,
  userId: string,
  image?: string,
  imageAssetId?: string,
) {
  try {
    await fetch(`${serverUrl}/user/update`, {
      method: "PATCH",
      credentials: "include",
      headers: await prepareHeaders(),
      body: JSON.stringify({
        name,
        id: userId,
        bio,
        image,
        imageAssetId,
      }),
    });
  } catch (error) {
    throw error;
  }
}

export async function searchUser(name: string, id: string): Promise<User[]> {
  try {
    const res = await fetch(
      `${serverUrl}/user/find?name=${name}&id=${id}`,
      {
        method: "GET",
        credentials: "include",
        headers: await prepareHeaders(),
      },
    );
    const user = await res.json();
    return user.data;
  } catch (error) {
    throw error;
  }
}

export async function getFriends(): Promise<User[]> {
  try {
    const res = await fetch(`${serverUrl}/friends/list-friend`, {
      method: "GET",
      credentials: "include",
      headers: await prepareHeaders(),
    });
    const friends = await res.json();
    return friends.data;
  } catch (error) {
    throw error;
  }
}

export async function getUserById(userId: string): Promise<User> {
  try {
    const res = await fetch(`${serverUrl}/user/${userId}`, {
      method: "GET",
      credentials: "include",
      headers: await prepareHeaders(),
    });

    const user = await res.json();
    return user.data;
  } catch (error) {
    throw error;
  }
}

export async function getPendingInvitation(
  userId: string,
): Promise<UserInvite[]> {
  try {
    const res = await fetch(
      `${serverUrl}/invitation/pending-invitation?userId=${userId}`,
      {
        method: "GET",
        credentials: "include",
        headers: await prepareHeaders(),
      },
    );

    const invitations = await res.json();
    return invitations.data as UserInvite[]
  } catch (error) {
    throw error;
  }
}

export async function getMyInvitation(userId: string): Promise<UserInvite[]> {
  try {
    const res = await fetch(
      `${serverUrl}/invitation/my-invitation?userId=${userId}`,
      {
        method: "GET",
        credentials: "include",
        headers: await prepareHeaders(),
      },
    );
    const invitation = await res.json();
    return invitation.data;
  } catch (error) {
    throw error;
  }
}


