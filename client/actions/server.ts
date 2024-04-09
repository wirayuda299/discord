"use server";

import { revalidatePath } from "next/cache";

import { ApiRequest } from "../utils/api";

const api = new ApiRequest();

export async function createServer(
  name: string,
  logo: string,
  logoAssetId: string,
) {
  try {
    const userId = api.getUserId;
    await api.post("/servers/create", {
      name,
      logo,
      ownerId: userId,
      logoAssetId,
    });
    revalidatePath("/");
  } catch (error) {
    throw error;
  }
}

export async function inviteUser(
  serverId: string,
  inviteCode: string,
  path: string,
  channelId: string,
) {
  try {
    await api.post("/servers/invite-user", {
      inviteCode,
      userId: api.getUserId,
      server_id: serverId,
      channelId,
    });
    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}
