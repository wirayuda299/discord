import { Permission } from "@/types/server";
import { getCookies } from "./cookies";

const serverUrl = process.env.SERVER_URL;

export interface Role {
  id: string;
  name: string;
  serverId: string;
  role_color: string;
  icon: string;
  icon_asset_id: string;
  members: any[];
  permissions: Permission;
}

const prepareHeaders = async () => {
  return {
    "content-type": "application/json",
    Cookie: await getCookies(),
  };
};
export async function getAllRoles(serverId: string): Promise<Role[]> {
  try {
    const res = await fetch(
      `${serverUrl}/roles/all-roles?serverId=${serverId}`,
      {
        method: "GET",
        headers: await prepareHeaders(),
        credentials: "include",
      },
    );
    const roles = await res.json();
    return roles.data;
  } catch (error) {
    throw error;
  }
}
export async function updateRole(
  color: string = "#99aab5",
  name: string = "new role",
  icon: string = "",
  iconAssetId: string = "",
  serverId: string,
  roleId: string,
  attachFile: boolean,
  banMember: boolean,
  kickMember: boolean,
  manageChannel: boolean,
  manageMessage: boolean,
  manageRole: boolean,
  manageThread: boolean,
) {
  try {
    await fetch(`${serverUrl}/roles/update-role`, {
      method: "PUT",
      headers: await prepareHeaders(),
      credentials: "include",
      body: JSON.stringify({
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
        roleId,
      }),
    });
  } catch (error) {
    throw error;
  }
}
