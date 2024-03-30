'use client';

import { Channel } from '@/types/channels';
import { createContext, ReactNode, useContext, useState } from 'react';

export type SheetContextState = {
	secondarySidebarOpen: boolean;
	sidebarOpen: boolean;
	memberSidebar: boolean;
	handleMemberOpen: (isOpen: boolean) => void;
	handleSidebarOpen: (isOpen: boolean) => void;
	handleSecondarySidebarOpen: (isOpen: boolean) => void;
	selectedChannel: Channel | null;
	handleSelectedChannel: (channel: Channel | null) => void;
};

const SheetContext = createContext<SheetContextState>({
	secondarySidebarOpen: false,
	handleMemberOpen: () => {},
	memberSidebar: false,
	sidebarOpen: false,
	handleSecondarySidebarOpen: () => {},
	handleSidebarOpen: () => {},
	selectedChannel: null,
	handleSelectedChannel: () => {},
});

export const SheetContextProvider = ({ children }: { children: ReactNode }) => {
	const [secondarySidebarOpen, setSecondarySidebarOpen] =
		useState<boolean>(false);
	const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
	const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
	const [memberOpen, setMemberOpen] = useState<boolean>(false);

	const handleSidebarOpen = (isOpen: boolean) => setSidebarOpen(isOpen);

	const handleSecondarySidebarOpen = (isOpen: boolean) =>
		setSecondarySidebarOpen(isOpen);

	const handleSelectedChannel = (channel: Channel | null) => {
		setSelectedChannel(channel);
	};
	const handleMemberOpen = (open: boolean) => {
		setMemberOpen(open);
	};

	return (
		<SheetContext.Provider
			value={{
				handleMemberOpen,
				memberSidebar: memberOpen,
				selectedChannel,
				handleSelectedChannel,
				secondarySidebarOpen,
				handleSecondarySidebarOpen,
				handleSidebarOpen,
				sidebarOpen,
			}}
		>
			{children}
		</SheetContext.Provider>
	);
};

export const useSheetContext = (): SheetContextState =>
	useContext(SheetContext);
