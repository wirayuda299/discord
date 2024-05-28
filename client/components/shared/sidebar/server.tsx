'use client';

import { useUser } from '@clerk/nextjs';
import Image from 'next/image';

import ChannelList from '@/components/servers/channels/list';
import { Servers } from '@/types/server';
import ServerMenu from '@/components/servers/server-menus';
import ChannelDrawerMobile from '@/components/servers/channels/ChannelMobile';
import { Channel } from '@/types/channels';

export default function ServerSidebar({
	channels,
	server
}: {
		server: Servers;
		channels: Channel[];
}) {
	const { user, isLoaded, isSignedIn } = useUser();
	console.log("Server sidebar");
	

	return (
		<ul className='no-scrollbar relative flex h-full min-h-screen  max-w-[255px] flex-col  justify-between gap-3 overflow-y-auto md:h-full md:min-w-[200px] md:bg-[#2b2d31] lg:min-w-[255px]'>
			<div className='size-full p-1'>
				{server.banner && server.settings.show_banner_background && (
					<Image
						src={server.banner}
						width={500}
						height={300}
						className='aspect-video max-h-28 w-full object-cover object-center'
						alt='banner'
						priority
						fetchPriority='high'
					/>
				)}
				{server && <ServerMenu server={server} />}
				{server.settings.show_progress_bar && (
					<div className='w-full p-2'>
						<div className='flex w-full justify-between'>
							<p className='text-sm font-semibold uppercase text-white'>
								LVL {server.level}
							</p>
							<p className='text-xs text-gray-2'>
								{server.boost_count} boost
							</p>
						</div>
						<div className='mt-1 h-1 w-full bg-gray-2'>
							<div
								className='h-1 rounded-full bg-gradient-to-r from-blue-600 via-purple-500 to-purple-600'
								style={{
									width: server.level_progress + '%',
								}}
							></div>
						</div>
					</div>
				)}
				<ChannelDrawerMobile
					channels={channels ?? []}
					server={server!}
				/>

				<ChannelList channels={channels ?? []} server={server} />
			</div>
			{isLoaded && isSignedIn && (
				<div className='sticky !bottom-0 left-0 flex min-h-16 w-full items-center bg-[#232428] px-3 text-white'>
					<div className='flex items-center gap-3'>
						<Image
							src={user?.imageUrl}
							width={40}
							className='aspect-auto min-h-10 min-w-10 rounded-full  object-cover '
							height={40}
							alt='user'
						/>
						<div>
							<h3 className='text-sm capitalize'>{user?.username}</h3>
							<p className='text-xs text-gray-2'>invisible</p>
						</div>
					</div>
				</div>
			)}
		</ul>
	);
}
