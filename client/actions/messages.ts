"use server";

import { revalidatePath } from "next/cache";

import { ApiRequest } from "@/utils/api";

const api = new ApiRequest();

export async function pinMessage(
  channelId: string,
  msgId: string,
  path: string,
) {
  try {
    await api.post("/messages/pin-message", {
      channelId,
      messageId: msgId,
    });
    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}
