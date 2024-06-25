import { BannedMembers } from '@/types/socket-states';
import { ApiRequest } from '@/utils/api';
import { createError } from '@/utils/error';

const api = new ApiRequest();

export async function getBannedMembers(
  serverId: string,
): Promise<BannedMembers[]> {
  try {
    const bannedMembers = await api.getData<BannedMembers[]>(
      `/members/banned?serverId=${serverId}`,
    );
    return bannedMembers;
  } catch (error) {
    throw error;
  }
}

export async function revokeMember(serverId: string, memberId: string) {
  try {
    await api.update(
      '/members/revoke',
      {
        serverId,
        memberId,
      },
      'PATCH',
    );

  } catch (error) {
    createError(error)
  }
}
