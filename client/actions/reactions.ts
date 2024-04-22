"use server";

import { ApiRequest } from "@/utils/api";
import { revalidatePath } from "next/cache";

const api = new ApiRequest(); 

export async function addOrRemoveReaction(
  messageId: string,
  emoji: string,
  unifiedEmoji: string,
  serverId: string,
  userId: string,
) {
  try {
    await api.post("/reactions/add-or-remove", {
      message_id: messageId,
      emoji,
      unified_emoji: unifiedEmoji,
      react_by: userId,
    });
    revalidatePath("/server/" + serverId);
  } catch (error) {
    console.log(error);

    throw error;
  }
}
