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
