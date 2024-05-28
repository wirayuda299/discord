'use client';

import {
	Dispatch,
	SetStateAction,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from 'react';

import { SocketStates } from '@/types/socket-states';
import { useAuth } from '@clerk/nextjs';
import { io } from 'socket.io-client';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { Message } from '@/types/messages';

type SocketContextIntialValue = {
	states: SocketStates;
	setValues: Dispatch<SetStateAction<SocketStates>>;
};

const initialValues: SocketContextIntialValue = {
	states: {
		active_users: [],
		channel_messages: [],
		personal_messages: [],
		thread_messages: [],
		socket: null,
		isConnected: false,
	},
	setValues: () => {},
};

export const SocketContext = createContext<SocketContextIntialValue>(initialValues);

export const SocketContextProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const { userId } = useAuth();
	const params = useParams();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const chat = searchParams.get('chat');

	const [values, setValues] = useState<SocketStates>(initialValues.states);

	const socketValues = useMemo(() => values, [values]);

	useEffect(() => {
		const serverUrl = process.env.NEXT_PUBLIC_ORIGIN || 'http://localhost:3001';

		const clientSocket = io(serverUrl, { query: { userId } });
		setValues((prev) => ({
			...prev,
			socket: clientSocket,
		}));

		return () => {
			clientSocket.disconnect();
		};
	}, [userId]);

	useEffect(() => {
		const socket = values.socket;
		if (socket === null) return;

		socket.on('connect', () => {
			setValues((prev) => ({
				...prev,
				isConnected: true,
			}));
		});

		socket.on('disconnect', () => {
			setValues((prev) => ({
				...prev,
				isConnected: false,
			}));
		});

		return () => {
			socket.disconnect();
		};
	}, [socketValues.socket, values.socket]);

	const reloadChannelMessage = useCallback(() => {
		values.socket?.emit('get-channel-message', {
			channelId: params?.channel_id as string,
			serverId: params?.id as string,
		});
	}, [params?.channel_id, params?.id, values.socket]);

	const reloadPersonalMessage = useCallback(() => {
		values.socket?.emit('personal-message', {
			conversationId: searchParams.get('conversationId') as string,
			userId: searchParams.get('chat') as string,
		});
	}, [values.socket, searchParams]);

	useEffect(() => {
		if (!values.socket) return;

		if (params?.channel_id && params?.id) {
			reloadChannelMessage();
		}

		if (pathname === '/direct-message' && chat) {
			reloadPersonalMessage();
		}

		values.socket.on('set-message', (messages: Message[]) => {
			setValues((prev) => ({
				...prev,
				channel_messages: messages,
			}));
		});
		values.socket.on('set-thread-messages', (messages: Message[]) => {
			setValues((prev) => ({
				...prev,
				thread_messages: messages,
			}));
		});

		values.socket.on('set-personal-messages', (messages: Message[]) => {
			setValues((prev) => ({
				...prev,
				personal_messages: messages,
			}));
		});
	}, [
		chat,
		params?.channel_id,
		params?.id,
		pathname,
		reloadChannelMessage,
		reloadPersonalMessage,
		setValues,
		values.socket,
	]);

	return (
		<SocketContext.Provider value={{ setValues, states: socketValues }}>
			{children}
		</SocketContext.Provider>
	);
};

export const useSocket = () => useContext(SocketContext);
