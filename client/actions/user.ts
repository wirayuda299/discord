'use server';

import { ApiRequest } from '@/utils/api';

const api = new ApiRequest();
const serverUrl = process.env.SERVER_URL;

export async function createUser(
  id: string,
  username: string,
  email: string,
  image: string,
) {
  try {
    await fetch(`${serverUrl}/user/create`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        id,
        username,
        email,
        image,
      }),
    });
  } catch (error) {
    console.log(error);

    throw error;
  }
}

export async function inviteUser(userToInvite: string, id: string) {
  try {
    return await api.update(
      `/invitation/invite-user`,
      {
        userToInvite,
        userId: id,
      },
      'POST',
    );
  } catch (error) {
    throw error;
  }
}
