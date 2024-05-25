import { BannedMembers } from "@/types/socket-states";
import { prepareHeaders } from "./cookies";

export async function getBannedMembers(serverId:string):Promise<BannedMembers[]> {
  try {
    const res = await fetch(process.env.SERVER_URL + `/members/banned?serverId=${serverId}`, {
      method: 'GET',
      headers: await prepareHeaders(),
      credentials:'include'
    });
    const bannedMembers = await res.json()
    return bannedMembers.data
  } catch (error) {
    throw error
  }
}

export async function revokeMember(serverId:string, memberId:string) {
  try {
      const res = await fetch(
				process.env.SERVER_URL + '/members/revoke',
				{
					method: 'PATCH',
					headers: await prepareHeaders(),
          credentials: 'include',
          body: JSON.stringify({
            serverId,
            memberId
          })
				}
    );
    const result = await res.json()
    return result
  } catch (error) {
    throw error
  }
}