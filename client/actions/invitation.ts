"use server";

import { ApiRequest } from "@/utils/api";

const api = new ApiRequest();

export async function acceptinvitation(friendId: string) {
  try {
    await api.post("/invitation/accept", { userId: api.getUserId, friendId });
  } catch (error) {
    throw error;
  }
}
export async function cancelInvitation(userId: string) {
  try {
    await api.post("/invitation/cancel", { userId });
  } catch (error) {
    throw error;
  }
}
