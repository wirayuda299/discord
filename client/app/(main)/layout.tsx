import type { ReactNode } from 'react';

import ServerSidebar from '@/components/sidebar/server';
import Sidebar from '@/components/sidebar/sidebar';
import Friends from '@/components/friends';
import ChannelDrawerMobile from '@/components/drawer/ChannelMobile';
import { ServerContextProvider } from '@/providers/server';
import SidebarMobile from '@/components/sidebar/mobile';
import SelectedChannel from '@/components/channels/selected-channel';

export default function MainLayout({ children }: { children: ReactNode }) {
	return (
		<ServerContextProvider>
			<div className='size-full'>
				<div className='flex h-screen w-full overflow-hidden'>
					<Sidebar />
					<ServerSidebar />
					<ChannelDrawerMobile />
					<div className='w-full'>
						<Friends />
						{children}
					</div>
					<SidebarMobile />
				</div>
			</div>
		</ServerContextProvider>
	);
}
