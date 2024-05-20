import { Message } from "./messages";
import { Permission } from "./server";

export type BannedMembers = {
    member_id: string,
    server_id: string,
    banned_by: string
}
export type SocketStates = {
	channel_messages: Message[];
	active_users: string[];
	personal_messages: Message[];
	thread_messages: Message[];
	user_roles: Permission | null;
	banned_members: BannedMembers[];
};
