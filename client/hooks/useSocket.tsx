import { useCallback, useEffect, useReducer, useMemo } from 'react';
import { socketReducer } from '@/reducer/socket';
import { useParams, useSearchParams } from 'next/navigation';
import { useSocketContext } from '@/providers/socket-io';
import { SocketStates } from '@/types/socket-states';
import { Message } from '@/types/messages';

const initialValues: SocketStates = {
	active_users: [] as string[],
	channel_messages: [],
	personal_messages: [],
	thread_messages: [],
	user_roles: null,
	banned_members: [],
};

export default function useSocket() {
	const { socket, userId } = useSocketContext();
	const searchParams = useSearchParams();
	const { id: serverId, channel_id: channelId } = useParams();
	const [states, dispatch] = useReducer(socketReducer, initialValues);

	const chat = useMemo(() => searchParams.get('chat'), [searchParams]);
	const conversationId = useMemo(
		() => searchParams.get('conversationId'),
		[searchParams]
	);

	const reloadChannelMessage = useCallback(
		(channelId: string, serverId: string) => {
			if (socket) {
				socket.emit('get-channel-message', { channelId, serverId });
			}
		},
		[socket]
	);

	const reloadPersonalMessage = useCallback(() => {
		if (socket && chat && conversationId) {
			socket.emit('personal-message', {
				userId: chat,
				conversationId,
			});
		}
	}, [socket, chat, conversationId]);

	const reloadThreadMessages = useCallback(
		(threadId: string) => {
			if (socket && serverId && channelId) {
				socket.emit('thread-messages', {
					threadId,
					serverId,
					channelId,
				});
			}
		},
		[socket, serverId, channelId]
	);

	const getUserRole = useCallback(
		(userId: string) => {
			if (socket && serverId) {
				socket.emit('member-roles', {
					serverId,
					userId,
				});
			}
		},
		[socket, serverId]
	);

	const getBannedMembers = useCallback(() => {
		if (socket && serverId) {
			socket.emit('banned-members', {
				serverId,
			});
		}
	}, [socket, serverId]);

	useEffect(() => {
		if (!socket || !userId) return;

		if (chat) {
			reloadPersonalMessage();
			socket.on('set-personal-messages', (messages: Message[]) => {
				dispatch({ type: 'PERSONAL_MESSAGES', payload: messages });
			});
		}

		if (channelId && serverId) {
			reloadChannelMessage(channelId as string, serverId as string);
			getBannedMembers();

			socket.on('set-message', (data) => {
				dispatch({ type: 'CHANNEL_MESSAGES', payload: data });
			});
			socket.on('set-banned-members', (data) => {
				dispatch({ type: 'BANNED_MEMBERS', payload: data });
			});
		}

		getUserRole(userId);

		socket.on('set-active-users', (data) => {
			dispatch({ type: 'ACTIVE_USERS', payload: data });
		});
		socket.on('set-current-user-role', (data) => {
			dispatch({ type: 'SET_USER_ROLES', payload: data });
		});
		socket.on('set-thread-messages', (data: Message[]) => {
			dispatch({ type: 'THREAD_MESSAGES', payload: data });
		});
	}, [
		socket,
		chat,
		conversationId,
		channelId,
		serverId,
		reloadPersonalMessage,
		reloadChannelMessage,
		getBannedMembers,
		getUserRole,
		userId,
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
		getBannedMembers,
		params: { serverId, channelId },
	};
}


