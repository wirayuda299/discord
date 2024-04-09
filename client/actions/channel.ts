"use server";

import { ApiRequest } from "../utils/api";
import { revalidatePath } from "next/cache";

const api = new ApiRequest();

export async function createChannel(
  name: string,
  serverId: string,
  type: string,
  path: string,
) {
  try {
    await api.post("/channels/create", {
      name,
      server_id: serverId,
      type,
    });
    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}
