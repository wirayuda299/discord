import { toast } from 'sonner';

import { Categories } from '@/types/channels';
import { Member, MemberWithRole, ServerProfile, Servers } from '@/types/server';
import { ApiRequest } from '@/utils/api';
import { createError } from '@/utils/error';
import { revalidate } from '@/utils/cache';

const api = new ApiRequest();

export async function getAllServerCreatedByCurrentUser(
  id: string
): Promise<Servers[]> {
  try {
    if (!id) return [];

    return await api.getData<Servers[]>(`/servers/all-servers?userId=${id}`);
  } catch (error) {
    throw error;
  }
}

export async function leaveServer(userId: string, serverId: string, channels: string[], channelId?: string) {
  try {
    await api.update('/servers/leave-server', { userId, serverId, channels }, 'DELETE')
    revalidate(`/server/${serverId}`)

    if (channelId) {
      revalidate(`/server/${serverId}/${channelId}`)
    }

  } catch (e) {
    createError(e)

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

export async function getAllChannels(id: string) {
  try {
    return await api.getData<Categories[]>(`/channels/list?serverId=${id}`);
  } catch (error) {
    throw error;
  }
}

export async function generateNewInviteCode(id: string, path: string) {
  try {
    await api.update(`/servers/new-invite-code`, { serverId: id }, 'PATCH');
    revalidate(path);
  } catch (error) {
    createError(error)
  }
}

export async function getServerMembers(id: string) {
  try {
    return await api.getData<Member[]>(`/members?serverId=${id}`);
  } catch (error) {
    throw error;
  }
}

export async function getMembersByRole(
  id: string,
  name: string,
): Promise<MemberWithRole[]> {
  try {
    if (!id || !name) return [];

    return await api.getData<MemberWithRole[]>(`/members/by-role?roleName=${name}&serverId=${id}`);
  } catch (error) {
    throw error;
  }
}

export async function getMemberWithoutRole(
  id: string
): Promise<MemberWithRole[]> {
  try {
    return await api.getData<MemberWithRole[]>(`/members/without-role?serverId=${id}`);
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

    const body = {
      serverId,
      currentSessionId,
      name,
      logo,
      logoAssetId,
      showBanner,
      showProgressBar,
      banner,
      bannerAssetId,
    }

    return await api.update(`/servers/update`, body, 'PATCH');
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
  const body = {
    serverId,
    userId,
    username,
    avatar,
    avatarAssetId,
    bio,
  }
  try {
    await api.update(`/servers/update-server-profile`, body, 'PATCH');
  } catch (error) {
    throw error;
  }
}

export async function deleteServer(serverId: string, currentSessionId: string, pathname: string) {
  try {
    await api.update(`/servers/delete`, { serverId, currentSessionId }, 'DELETE');
    toast.success("Server has been deleted")
    revalidate(pathname);
  } catch (error) {
    createError(error)
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


export async function updateChannel(
  channelId: string,
  userId: string,
  serverId: string,
  name: string,
  serverAuthor: string,
  topic: string = '') {
  try {
    const body = {
      name, topic, userId, serverId, serverAuthor, channelId
    }
    return await api.update('/channels/update', body, "PUT")
  } catch (e) {
    throw e
  }
}


export async function deleteChannel(
  serverId: string,
  userId: string,
  channelId: string,
  serverAuthor: string,
  pathname: string,
  type: string) {

  try {
    const body = {
      serverId,
      userId,
      channelId,
      serverAuthor,
      type
    }

    await api.update('/channels/delete', body, "DELETE")
    revalidate(pathname)

  } catch (e) {
    throw e
  }

}
