'use server';

import { ApiRequest } from '../utils/api';
import { revalidatePath } from 'next/cache';

const api = new ApiRequest();

export async function createChannel(
  name: string,
  serverId: string,
  type: string,
  userId: string,
  serverAuthor: string,
) {
  try {
    const body = {
      name,
      server_id: serverId,
      type,
      userId,
      serverAuthor,
    };
    await api.update('/channels/create', body, 'POST');
    revalidatePath(`/server/${serverId}`);
  } catch (error) {
    throw error;
  }
}
