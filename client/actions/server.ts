"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { ApiRequest } from "../utils/api";

const api = new ApiRequest();

export async function createServer(
  name: string,
  logo: string,
  logoAssetId: string,
  userId: string,
) {
  try {
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
	userId: string,
	inviteCode: string,
) {
	try {
		await api.post('/servers/invite-user', {
			inviteCode,
			userId,
			serverId,
    });
    revalidateTag('members');
	} catch (error) {
		console.log(error);

		throw error;
	}
}
