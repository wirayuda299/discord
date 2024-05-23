import { Message } from "@/types/messages";
import { Permission } from "@/types/server";
import { BannedMembers, SocketStates } from "@/types/socket-states";

type Action =
	| { type: 'PERSONAL_MESSAGES'; payload: Message[] } 
	| { type: 'CHANNEL_MESSAGES'; payload: Message[] } 
	| { type: 'BANNED_MEMBERS'; payload: BannedMembers[] }
	| { type: 'ACTIVE_USERS'; payload: string[] }
	| { type: 'SET_USER_ROLES'; payload: Permission }
	| { type: 'THREAD_MESSAGES'; payload: Message[] }; 

export function socketReducer(states: SocketStates, action: Action) {
	switch (action.type) {
		case 'ACTIVE_USERS':
			return {
				...states,
				active_users: action.payload,
			};
		case 'PERSONAL_MESSAGES':
			return {
				...states,
				personal_messages: action.payload,
			};
		case 'CHANNEL_MESSAGES':
			return {
				...states,
				channel_messages: action.payload,
			};

		case 'THREAD_MESSAGES':
			return {
				...states,
				thread_messages: action.payload,
			};
		case 'SET_USER_ROLES':
			return {
				...states,
				user_roles: action.payload,
			};
		case 'BANNED_MEMBERS':
			return {
				...states,
				banned_members: action.payload,
			};

		default:
			throw new Error('Invalid action');
	}
}
