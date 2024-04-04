'use client';
import { Channel } from '@/types/channels';
import { Servers } from '@/types/server';
import {
	useState,
	Dispatch,
	ReactNode,
	useContext,
	createContext,
	SetStateAction,
} from 'react';

export type ServerContextType = {
	selectedChannel: Channel | null;
	setSelectedChannel: Dispatch<SetStateAction<Channel | null>>;
	selectedServer: Servers | null;
	setSelectedServer: Dispatch<SetStateAction<Servers | null>>;
};

type ContextProviderProps = {
	children: ReactNode;
};

const ServerContext = createContext<ServerContextType>({
	selectedChannel: null,
	selectedServer: null,
	setSelectedServer: () => {},
	setSelectedChannel: () => {},
});

export const ServerContextProvider = ({ children }: ContextProviderProps) => {
	const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
	const [selectedServer, setSelectedServer] = useState<Servers | null>(null);

	return (
		<ServerContext.Provider
			value={{
				selectedChannel,
				setSelectedChannel,
				selectedServer,
				setSelectedServer,
			}}
		>
			{children}
		</ServerContext.Provider>
	);
};

export const useServerContext = () => useContext(ServerContext);
