import { BannedMembers } from '@/types/socket-states';
import { prepareHeaders } from './cookies';
import { ApiRequest } from '@/utils/api';

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
    const revokeMember = await api.update(
      '/members/revoke',
      {
        serverId,
        memberId,
      },
      'PATCH',
    );

    return revokeMember;
  } catch (error) {
    throw error;
  }
}
