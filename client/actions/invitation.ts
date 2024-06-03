'use server';

import { ApiRequest } from '@/utils/api';

const api = new ApiRequest();

export async function acceptinvitation(friendId: string, userId: string) {
  try {
    await api.update('/invitation/accept', { userId, friendId }, 'POST');
  } catch (error) {
    throw error;
  }
}
export async function cancelInvitation(userId: string) {
  try {
    await api.update('/invitation/cancel', { userId }, 'POST');
  } catch (error) {
    throw error;
  }
}
