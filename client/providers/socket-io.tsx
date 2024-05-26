'use client';

import { useAuth } from '@clerk/nextjs';
import { Socket, io } from 'socket.io-client';
import {
	ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useReducer,
	useState,
} from 'react';
import { ReadonlyURLSearchParams, useParams, useSearchParams } from 'next/navigation';
import { socketReducer } from '@/reducer/socket';
import { SocketStates } from '@/types/socket-states';
import { Message } from '@/types/messages';

const initialValues: SocketStates = {
	active_users: [] as string[],
	channel_messages: [],
	personal_messages: [],
	thread_messages: [],
};

export type SocketContextType = {
	socket: Socket | null;
	isConnected: boolean;
	userId: string;
	states: SocketStates;
	reloadChannelMessage: (channelId: string, serverId: string) => void;
	reloadPersonalMessage: () => void;
	reloadThreadMessages: (threadId: string) => void;
	params: {
		serverId: string | string[];
		channelId: string | string[];
	};
	searchParams: ReadonlyURLSearchParams;
};

export const SocketContext = createContext<SocketContextType>(
	{} as SocketContextType
);

export const SocketContextProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const { userId } = useAuth();

	const [isConnected, setIsConnected] = useState<boolean>(false);
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
			if (socket && channelId && serverId) {
				socket.emit('get-channel-message', { channelId, serverId });
			}
		},
		[socket, serverId, channelId]
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

	useEffect(() => {
		const serverUrl = process.env.NEXT_PUBLIC_ORIGIN || 'http://localhpst:3001';
		const clientSocket = io(serverUrl!, {
			query: {
				userId,
			},
		});
		setSocket(clientSocket);

		return () => {
			clientSocket.disconnect();
		};
	}, [userId]);

	useEffect(() => {
		if (!socket) return;

		socket.on('connect', () => {
			setIsConnected(true);
		});

		socket.on('disconnect', () => {
			setIsConnected(false);
		});

		return () => {
			socket.disconnect();
		};
	}, [socket]);

	useEffect(() => {
		if (!socket || !userId || !isConnected) return;

		if (chat) {
			reloadPersonalMessage();
			socket.on('set-personal-messages', (messages: Message[]) => {
				dispatch({ type: 'PERSONAL_MESSAGES', payload: messages });
			});
		}

		if (channelId && serverId) {
			reloadChannelMessage(channelId as string, serverId as string);

			socket.on('set-message', (data) => {
				dispatch({ type: 'CHANNEL_MESSAGES', payload: data });
			});
		}

		socket.on('set-active-users', (data) => {
			dispatch({ type: 'ACTIVE_USERS', payload: data });
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
		userId,
		isConnected,
	]);

	const value = useMemo(
		() => ({
			states,
			reloadChannelMessage,
			reloadPersonalMessage,
			reloadThreadMessages,
			searchParams,
			isConnected,
			socket,
			userId: userId as string,
			params: { serverId, channelId },
		}),
		[
			states,
			reloadChannelMessage,
			reloadPersonalMessage,
			reloadThreadMessages,
			searchParams,
			isConnected,
			socket,
			userId,
			serverId,
			channelId,
		]
	);

	return (
		<SocketContext.Provider value={value}>{children}</SocketContext.Provider>
	);
};

export function useSocketContext() {
	return useContext(SocketContext);
}
