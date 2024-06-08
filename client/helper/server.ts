import { revalidatePath } from 'next/cache';

import { Categories } from '@/types/channels';
import { Member, MemberWithRole, ServerProfile, Servers } from '@/types/server';
import { ApiRequest } from '@/utils/api';

const api = new ApiRequest();

export async function getAllServerCreatedByCurrentUser(
  userId: string,
): Promise<Servers[]> {
  try {
    if (!userId) return [];

    const servers = await api.getData<Servers[]>(
      `/servers/all-servers?userId=${userId}`,
    );

    return servers;
  } catch (error) {
    throw error;
  }
}

export async function getServerById(id: string) {
  try {
    return await api.getData<Servers>(`/servers/${id}`);
  } catch (error) {
    throw error;
  }
}
export async function getServerByCode(code: string) {
  try {
    return await api.getData<Servers>(`/servers?invite_code=${code}`);
  } catch (error) {
    throw error;
  }
}

export async function getAllChannels(serverId: string) {
  try {
    return await api.getData<Categories[]>(
      `/channels/list?serverId=${serverId}`,
    );
  } catch (error) {
    throw error;
  }
}

export async function generateNewInviteCode(serverId: string, path: string) {
  try {
    await api.update(
      `/servers/new-invite-code`,
      {
        serverId,
      },
      'PATCH',
    );
    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}

export async function getServerMembers(serverId: string) {
  try {
    const members = await api.getData<Member[]>(
      `/members?serverId=${serverId}`,
    );
    return members;
  } catch (error) {
    throw error;
  }
}

export async function getMembersByRole(
  serverId: string,
  roleName: string,
): Promise<MemberWithRole[]> {
  try {
    if (!serverId || !roleName) return [];

    const members = await api.getData<MemberWithRole[]>(
      `/members/by-role?roleName=${roleName}&serverId=${serverId}`,
    );

    return members;
  } catch (error) {
    throw error;
  }
}

export async function getMemberWithoutRole(
  serverId: string,
): Promise<MemberWithRole[]> {
  try {
    return await api.getData<MemberWithRole[]>(
      `/members/without-role?serverId=${serverId}`,
    );
  } catch (error) {
    throw error;
  }
}

export async function updateServer(
  serverId: string,
  name: string,
  logo: string,
  logoAssetId: string,
  banner: string,
  bannerAssetId: string,
  currentSessionId: string,
  showBanner: boolean,
  showProgressBar: boolean,
) {
  try {
    return await api.update(
      `/servers/update`,
      {
        serverId,
        currentSessionId,
        name,
        logo,
        logoAssetId,
        showBanner,
        showProgressBar,
        banner,
        bannerAssetId,
      },
      'PATCH',
    );
  } catch (error) {
    throw error;
  }
}

export async function getServerProfile(
  id: string,
  userId: string,
): Promise<ServerProfile> {
  try {
    return await api.getData<ServerProfile>(
      `/servers/server-profile?serverId=${id}&userId=${userId}`,
    );
  } catch (error) {
    throw error;
  }
}

export async function updateServerProfile(
  serverId: string,
  userId: string,
  username: string,
  avatar: string,
  avatarAssetId: string,
  bio: string,
) {
  try {
    await api.update(
      `/servers/update-server-profile`,
      {
        serverId,
        userId,
        username,
        avatar,
        avatarAssetId,
        bio,
      },
      'PATCH',
    );
  } catch (error) {
    throw error;
  }
}

export async function deleteServer(serverId: string, currentSessionId: string) {
  try {
    await api.update(
      `/servers/delete`,
      {
        serverId,
        currentSessionId,
      },
      'DELETE',
    );
    revalidatePath('/server');
  } catch (error) {
    throw error;
  }
}

export async function isMemberOrAdmin(
  userId: string,
  serverId: string,
): Promise<{
  isMember: boolean;
  isAuthor: boolean;
}> {
  try {
    return await api.getData<{ isMember: boolean; isAuthor: boolean }>(
      `/members/is-member-or-author?userId=${userId}&serverId=${serverId}`,
    );
  } catch (error) {
    throw error;
  }
}
