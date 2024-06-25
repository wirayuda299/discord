'use server';

import { ApiRequest } from '@/utils/api';
import { revalidatePath } from 'next/cache';

const api = new ApiRequest();


export async function banMember(
  serverId: string,
  memberId: string,
  bannedBy: string,
  pathname: string
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
    revalidatePath(pathname);
  } catch (error) {
    throw error;
  }
}
