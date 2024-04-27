import { Channel } from "@/types/channels";
import { revalidatePath } from "next/cache";
import { Member, ServerProfile, Servers } from "@/types/server";
import { getCookies } from "./cookies";

const serverUrl = process.env.SERVER_URL;

const prepareHeaders = async () => {
  return {
    "content-type": "application/json",
    Cookie: await getCookies(),
  };
};

export async function getAllServerCreatedByCurrentUser(
  userId: string,
): Promise<Servers[]> {
  try {
    const res = await fetch(
      `${serverUrl}/servers/all-servers?userId=${userId}`,
      {
        headers: await prepareHeaders(),
        method: "GET",
        credentials: "include",
      },
    );

    const servers = await res.json();
    return servers.data;
  } catch (error) {
    throw error;
  }
}

export async function getServerById(
  id: string,
): Promise<{ server: Servers[]; channels: Channel[] }> {
  try {
    const res = await fetch(`${serverUrl}/servers/${id}`, {
      headers: await prepareHeaders(),
      method: "GET",
      credentials: "include",
    });
    const server = await res.json();

    return server.data;
  } catch (error) {
    throw error;
  }
}

export async function generateNewInviteCode(serverId: string, path: string) {
  try {
    await fetch(`${serverUrl}/servers/new-invite-code`, {
      method: "PATCH",
      headers: await prepareHeaders(),
      credentials: "include",
      body: JSON.stringify({
        serverId,
      }),
    });
    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}

export async function getServerMembers(serverId: string): Promise<Member[]> {
  try {
    const res = await fetch(
      `${serverUrl}/servers/members?serverId=${serverId}`,
      {
        headers: await prepareHeaders(),
        method: "GET",
        credentials: "include",
      },
    );

    const members = await res.json();
    return members.data;
  } catch (error) {
    throw error;
  }
}

export async function updateServer(
  serverId: string,
  name: string,
  logo: string,
  logoAssetId: string,
  currentSessionId: string,
) {
  try {
    await fetch(`${serverUrl}/servers/update`, {
      method: "PATCH",
      credentials: "include",
      headers: await prepareHeaders(),
      body: JSON.stringify({
        serverId,
        currentSessionId,
        name,
        logo,
        logoAssetId,
      }),
    });
    revalidatePath("/server");
  } catch (error) {
    throw error;
  }
}

export async function getServerProfile(
  id: string,
  userId: string,
): Promise<ServerProfile> {
  try {
    const res = await fetch(
      `${serverUrl}/servers/server-profile?serverId=${id}&userId=${userId}`,
      {
        method: "GET",
        credentials: "include",
        headers: await prepareHeaders(),
      },
    );
    const serverProfile = await res.json();
    return serverProfile.data;
  } catch (error) {
    throw error;
  }
}

export async function updateServerProfile(
  serverId: string,
  userId: string,
  username: string,
  avatar: string,
  avatarAssetId: string,
  bio: string,
) {
  try {
    await fetch(`${serverUrl}/servers/update-server-profile`, {
      method: "PATCH",
      credentials: "include",
      headers: await prepareHeaders(),
      body: JSON.stringify({
        serverId,
        userId,
        username,
        avatar,
        avatarAssetId,
        bio,
      }),
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteServer(serverId: string, currentSessionId: string) {
  try {
    await fetch(`${serverUrl}/servers/delete`, {
      method: "DELETE",
      credentials: "include",
      headers: await prepareHeaders(),
      body: JSON.stringify({
        serverId,
        currentSessionId,
      }),
    });
    revalidatePath("/server");
  } catch (error) {
    throw error;
  }
}
