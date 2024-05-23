'use client';
import {
	useMemo,
	useState,
	ReactNode,
	useContext,
	createContext,
	Dispatch,
	SetStateAction,
} from 'react';

import { Channel } from '@/types/channels';
import { Servers } from '@/types/server';
import { Message, Thread } from '@/types/messages';

export type ServerStates = {
	selectedChannel: Channel | null;
	selectedServer: Servers | null;
	selectedSetting: string;
	selectedOption: string;
	selectedMessage: {
		type: 'personal' | 'thread' | 'channel' | 'reply';
		message: Message;
		action: string;
	} | null;
	selectedThread: Thread | null;
};

export type ServerContextType = {
	serversState: ServerStates;
	setServerStates: Dispatch<SetStateAction<ServerStates>>;
};

const ServerContext = createContext<ServerContextType>({
	serversState: {
		selectedChannel: null,
		selectedServer: null,
		selectedSetting: 'my account',
		selectedOption: 'user',
		selectedMessage: null,
		selectedThread: null,
	},
	setServerStates: () => {},
});

export const ServerContextProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [states, setStates] = useState<ServerStates>({
		selectedChannel: null,
		selectedServer: null,
		selectedSetting: 'my account',
		selectedOption: 'user',
		selectedMessage: null,
		selectedThread: null,
	});

	const { serverStates, setServerStates } = useMemo(() => {
		return {
			serverStates: states,
			setServerStates: setStates,
		};
	}, [states]);

	return (
		<ServerContext.Provider
			value={{
				serversState: serverStates,
				setServerStates,
			}}
		>
			{children}
		</ServerContext.Provider>
	);
};

export const useServerContext = () => useContext(ServerContext);
