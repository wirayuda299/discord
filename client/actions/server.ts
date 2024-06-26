'use server';

import { revalidatePath } from 'next/cache';

import { ApiRequest } from '../utils/api';

const api = new ApiRequest();

export async function createServer(
  name: string,
  logo: string,
  logoAssetId: string,
  userId: string,
) {
  try {
    await api.update(
      '/servers/create',
      {
        name,
        logo,
        ownerId: userId,
        logoAssetId,
      },
      'POST',
    );
    revalidatePath('/');
  } catch (error) {
    throw error;
  }
}


export async function joinServer(serverId: string, userId: string, inviteCode: string) {
  try {
    await api.update(
      '/servers/join',
      {
        inviteCode,
        userId,
        serverId,
      },
      'POST'
    );

    revalidatePath('/');

    return {
      success: true,
      message: 'Success'
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message
    };
  }
}

