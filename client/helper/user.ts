import { User, UserInvite } from '@/types/user';
import { prepareHeaders } from './cookies';
import { ApiRequest } from '@/utils/api';

const api = new ApiRequest();

export async function updateUser(
  name: string,
  bio: string,
  userId: string,
  image?: string,
  imageAssetId?: string,
) {
  try {
    await api.update(
      `/user/update`,
      {
        name,
        id: userId,
        bio,
        image,
        imageAssetId,
      },
      'PATCH',
    );
  } catch (error) {
    throw error;
  }
}

export async function searchUser(name: string, id: string): Promise<User[]> {
  try {
    return await api.getData<User[]>(`/user/find?name=${name}&id=${id}`);
  } catch (error) {
    throw error;
  }
}

export async function getFriends(): Promise<User[]> {
  try {
    return await api.getData<User[]>(`/friends/list-friend`);
  } catch (error) {
    throw error;
  }
}

export async function getUserById(userId: string): Promise<User> {
  try {
    return await api.getData(`/user/${userId}`);
  } catch (error) {
    throw error;
  }
}

export async function getPendingInvitation(
  userId: string,
): Promise<UserInvite[]> {
  try {
    return await api.getData<UserInvite[]>(
      `/invitation/pending-invitation?userId=${userId}`,
    );
  } catch (error) {
    throw error;
  }
}

export async function getMyInvitation(userId: string): Promise<UserInvite[]> {
  try {
    return await api.getData<UserInvite[]>(
      `/invitation/my-invitation?userId=${userId}`,
    );
  } catch (error) {
    throw error;
  }
}
