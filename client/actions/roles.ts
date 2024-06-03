'use server';

import { ApiRequest } from '@/utils/api';

const api = new ApiRequest();

export async function createRole(
  color: string = '#99aab5',
  name: string = 'new role',
  icon: string = '',
  iconAssetId: string = '',
  serverId: string,
  attachFile: boolean = false,
  banMember: boolean = false,
  kickMember: boolean = false,
  manageChannel: boolean = false,
  manageMessage: boolean = false,
  manageRole: boolean = false,
  manageThread: boolean = false,
  userId: string,
  serverAuthor: string,
) {
  try {
    await api.update(
      '/roles/create',
      {
        color,
        name,
        icon,
        icon_asset_id: iconAssetId,
        serverId,
        attach_file: attachFile,
        ban_member: banMember,
        kick_member: kickMember,
        manage_channel: manageChannel,
        manage_message: manageMessage,
        manage_role: manageRole,
        manage_thread: manageThread,
        userId,
        serverAuthor,
      },
      'POST',
    );
  } catch (error) {
    throw error;
  }
}

export async function assignRole(
  userId: string,
  roleId: string,
  permissionId: string,
) {
  try {
    await api.update(
      '/roles/assign-role',
      {
        role_id: roleId,
        user_id: userId,
        permission_id: permissionId,
      },
      'POST',
    );
  } catch (error) {
    throw error;
  }
}
