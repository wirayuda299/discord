import { useCallback, useEffect, useReducer, useMemo, useState } from 'react';
import { socketReducer } from '@/reducer/socket';
import { useParams, useSearchParams } from 'next/navigation';
import { useSocketContext } from '@/providers/socket-io';
import { SocketStates } from '@/types/socket-states';

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
	const [loading, setLoading] = useState(true);

	const chat = useMemo(() => searchParams.get('chat'), [searchParams]);
	const conversationId = useMemo(
		() => searchParams.get('conversationId'),
		[searchParams]
	);

	const reloadChannelMessage = useCallback(
		(channelId:string, serverId:string) => {
			if (socket) {
				setLoading(true);
				socket.emit('get-channel-message', { channelId, serverId });
			}
		},
		[socket]
	);

	const reloadPersonalMessage = useCallback(() => {
		if (socket && chat && conversationId) {
			setLoading(true);
			socket.emit('personal-message', { userId: chat, conversationId });
		}
	}, [socket, chat, conversationId]);

	useEffect(() => {
		if (!socket || !userId) return;

		if (chat) {
			reloadPersonalMessage();
			socket.on('set-personal-messages', (messages) => {
				dispatch({ type: 'PERSONAL_MESSAGES', payload: messages });
				setLoading(false);
			});
		}

		if (channelId && serverId) {
			reloadChannelMessage(channelId as string, serverId as string);
			socket.on('set-message', (data) => {
				dispatch({ type: 'CHANNEL_MESSAGES', payload: data });
				setLoading(false);
			});
		}

		socket.on('set-active-users', (data) => {
			dispatch({ type: 'ACTIVE_USERS', payload: data });
		});
	}, [
		socket,
		chat,
		conversationId,
		channelId,
		serverId,
		reloadPersonalMessage,
		reloadChannelMessage,
		userId,
	]);

	return {
		reloadChannelMessage,
		states,
		dispatch,
		reloadPersonalMessage,
		loading,
		socket,
		userId,
		searchParams,
		params: { serverId, channelId },
	};
}
