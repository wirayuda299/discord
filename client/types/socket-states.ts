import { Message } from "postcss";
import { Permission } from "./server";

export type SocketStates = {
	channel_messages: Message[];
	active_users: string[];
	personal_messages: Message[];
	thread_messages: Message[];
	user_roles: Permission|null
};
