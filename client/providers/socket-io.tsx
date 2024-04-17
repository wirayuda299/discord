'use client';
import { Message } from '@/types/messages';
import { useAuth } from '@clerk/nextjs';
import {
	Dispatch,
	FC,
	ReactNode,
	SetStateAction,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';
import { Socket, io } from 'socket.io-client';

export type SocketContextType = {
	socket: Socket | null;
	isConnected: boolean;
	activeUsers: string[];
	channelMessages: Message[];
	setChannelMessages: Dispatch<SetStateAction<Message[]>>;
};

type ContextProviderProps = {
	children: ReactNode;
};
export const SocketContext = createContext<SocketContextType>({
	activeUsers: [],
	isConnected: false,
	socket: null,
	channelMessages: [],
	setChannelMessages: () => {},
});

export const SocketContextProvider: FC<ContextProviderProps> = ({
	children,
}) => {
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [socket, setSocket] = useState<Socket | null>(null);
	const [activeUsers, setActiveUsers] = useState<string[]>([]);
	const [channelMessages, setChannelMessages] = useState<Message[]>([]);
	const { userId } = useAuth();
	useEffect(() => {
		const clientSocket = io('http://localhost:3001', {
			query: {
				userId,
			},
		});
		setSocket(clientSocket);

		clientSocket.on('connect', () => {
			setIsConnected(true);
		});

		clientSocket.on('disconnect', () => {
			setIsConnected(false);
		});

		return () => {
			clientSocket.disconnect();
		};
	}, [userId]);

	useEffect(() => {
		if (!socket) return;
		socket.on('set-active-users', (data) => {
			setActiveUsers(data);
		});
	}, [socket]);

	return (
		<SocketContext.Provider
			value={{
				setChannelMessages,
				channelMessages,
				activeUsers,
				isConnected,
				socket,
			}}
		>
			{children}
		</SocketContext.Provider>
	);
};

export function useSocketContext() {
	return useContext(SocketContext);
}
