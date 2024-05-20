"use server";

import { ApiRequest } from "@/utils/api";

const api = new ApiRequest();

export async function acceptinvitation(friendId: string, userId:string) {
  try {
    await api.post("/invitation/accept", { userId, friendId });
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
