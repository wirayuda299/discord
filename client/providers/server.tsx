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
	selectedSetting: string;
	selectedOption: string;
	setSelectedOption: Dispatch<SetStateAction<string>>;
	setSelectedSetting: Dispatch<SetStateAction<string>>;
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
	selectedSetting: 'my account',
	setSelectedSetting: () => {},
	selectedOption: 'user',
	setSelectedOption: () => {},
});

export const ServerContextProvider = ({ children }: ContextProviderProps) => {
	const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
	const [selectedServer, setSelectedServer] = useState<Servers | null>(null);
	const [selectedSetting, setSelectedSetting] = useState<string>('my account');
	const [selectedOption, setSelectedOption] = useState<string>('user');

	return (
		<ServerContext.Provider
			value={{
				selectedOption,
				setSelectedOption,
				selectedSetting,
				setSelectedSetting,
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
