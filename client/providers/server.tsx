'use client';
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
	type ReactNode,
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

const initialValues: ServerStates = {
	selectedChannel: null,
	selectedServer: null,
	selectedSetting: 'my account',
	selectedOption: 'user',
	selectedMessage: null,
	selectedThread: null,
};

type ServerContextType = {
	states: ServerStates;
	updateState: (value: Partial<typeof initialValues>) => void;
};

const socketStates = {
	states: initialValues,
	updateState: () => {},
};

const ServerStatesContext = createContext<ServerContextType>(socketStates);

export const ServerContextProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [states, setStates] = useState(initialValues);
	const memoized = useMemo(() => states, [states]);

	const updateState = useCallback((value: Partial<typeof initialValues>) => {
		setStates((prev) => ({ ...prev, ...value }));
	}, []);
	return (
		<ServerStatesContext.Provider
			value={{ states: memoized,  updateState }}
		>
			{children}
		</ServerStatesContext.Provider>
	);
};

export const useServerContext = () => useContext(ServerStatesContext);
