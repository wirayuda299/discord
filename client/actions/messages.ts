"use server";

import { revalidatePath } from "next/cache";

import { ApiRequest } from "@/utils/api";

const api = new ApiRequest();

export async function pinMessage(
  channelId: string,
  msgId: string,
  pinnedBy: string,
  path: string,
) {
  try {
    await api.post("/messages/pin-message", {
      channelId,
      messageId: msgId,
      pinnedBy,
    });
    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}
