import type { ReactNode } from 'react';

import ServerSidebar from '@/components/sidebar/server';
import Sidebar from '@/components/sidebar/sidebar';
import FriendHeader from '@/components/friends-header';
import ChannelDrawerMobile from '@/components/drawer/ChannelMobile';
import SidebarMobile from '@/components/sidebar/mobile';

export default async function MainLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<div className='size-full'>
			<div className='flex h-screen w-full overflow-hidden'>
				<Sidebar />
				<ServerSidebar />
				<ChannelDrawerMobile />
				<div className='w-full'>
					<FriendHeader />
					{children}
				</div>
				<SidebarMobile />
			</div>
		</div>
	);
}
