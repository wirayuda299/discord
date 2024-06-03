'use server';

import { ApiRequest } from '@/utils/api';
import { revalidatePath } from 'next/cache';

const api = new ApiRequest();

export async function kickMember(
  serverId: string,
  memberId: string,
  serverAuthor: string,
  currentUser: string,
) {
  try {
    await api.update(
      `/members/kick`,
      {
        serverId,
        memberId,
        serverAuthor,
        currentUser,
      },
      'POST',
    );
    revalidatePath(`/server/${serverId}`);
  } catch (error) {
    throw error;
  }
}

export async function banMember(
  serverId: string,
  memberId: string,
  bannedBy: string,
) {
  try {
    await api.update(
      '/members/ban',
      {
        serverId,
        memberId,
        bannedBy,
      },
      'POST',
    );
    revalidatePath(`/server/${serverId}`);
  } catch (error) {
    throw error;
  }
}
