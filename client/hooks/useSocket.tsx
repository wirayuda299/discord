import { useCallback, useEffect, useReducer } from 'react';
import { socketReducer } from '@/reducer/socket';
import { useParams, useSearchParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

import { useSocketContext } from '@/providers/socket-io';
import { Permission } from '@/types/server';
import { SocketStates } from '@/types/socket-states';

const intialValues: SocketStates = {
	active_users: [] as string[],
	channel_messages: [],
	personal_messages: [],
	thread_messages: [],
	user_roles: null,
};

export default function useSocket() {
	const { userId } = useAuth();
	const searchParams = useSearchParams();
	const params = useParams();
	const { socket } = useSocketContext();
	const [states, dispatch] = useReducer(socketReducer, intialValues);

	const reloadChannelMessage = useCallback(
		(channelId: string, serverId: string) => {
			if (socket) {
				socket?.emit('get-channel-message', {
					channelId,
					serverId,
				});
			}
		},
		[socket]
	);

	const reloadPersonalMessage = useCallback(() => {
		socket?.emit('personal-message', {
			userId: searchParams.get('chat'),
			conversationId: searchParams.get('conversationId'),
		});
	}, [searchParams, socket]);

	const reloadThreadMessages = (threadId: string) => {
		if (socket) {
			socket.emit('thread-messages', {
				threadId,
				serverId: params.id as string,
				channelId: params.channel_id,
			});
		}
	};
	const getUserRole = useCallback(
		(userId: string) => {
			if (socket) {
				socket.emit('member-roles', {
					serverId: params.id as string,
					userId,
				});
			}
		},
		[params.id, socket]
	);

	useEffect(() => {
		if (!socket) return;

		if (searchParams.get('chat')) {
			reloadPersonalMessage();
			socket.on('set-personal-messages', (messages) => {
				dispatch({ type: 'PERSONAL_MESSAGES', payload: messages });
			});
		}

		if (params.channel_id && params.id) {
			reloadChannelMessage(params.channel_id as string, params.id as string);

			socket.on('set-message', (data) => {
				dispatch({ type: 'CHANNEL_MESSAGES', payload: data });
			});
		}

		socket.on('set-active-users', (data) => {
			dispatch({ type: 'ACTIVE_USERS', payload: data });
		});
		getUserRole(userId!);
		socket.on('set-current-user-role', (data: Permission) => {
			dispatch({ type: 'SET_USER_ROLES', payload: data as Permission });
		});

		socket.on('set-thread-messages', (data) => {
			dispatch({ type: 'THREAD_MESSAGES', payload: data });
		});
	}, [
		socket,
		searchParams,
		params,
		getUserRole,
		userId,
		reloadPersonalMessage,
		reloadChannelMessage,
	]);

	return {
		reloadChannelMessage,
		states,
		dispatch,
		reloadPersonalMessage,
		reloadThreadMessages,
		searchParams,
		socket,
		userId,
		getUserRole,
		params,
	};
}
