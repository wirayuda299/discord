'use client';

import { useUser } from '@clerk/nextjs';
import Image from 'next/image';

import ChannelList from '@/components/servers/channels/list';
import { Servers } from '@/types/server';
import ServerMenu from '@/components/servers/channels/server-menus';
import ChannelDrawerMobile from '@/components/servers/channels/ChannelMobile';
import { Channel } from '@/types/channels';

export default function ServerSidebar({
	data,
}: {
	data: {
		server: Servers;
		channels: Channel[];
	};
}) {
	const { user, isLoaded, isSignedIn } = useUser();
	console.log(data);

	return (
		<ul className='no-scrollbar relative flex h-full min-h-screen  max-w-[255px] flex-col  justify-between gap-3 overflow-y-auto md:h-full md:min-w-[200px] md:bg-[#2b2d31] lg:min-w-[255px]'>
			<div className='size-full p-1'>
				{data.server.banner && data.server.settings.show_banner_background && (
					<Image
						src={data.server.banner}
						width={500}
						height={300}
						className='w-full object-cover'
						alt='banner'
					/>
				)}
				{data.server && (
					<ServerMenu
						banner={data.server.banner}
						showBanner={data.server.settings.show_banner_background}
						serverName={data.server.name}
						serverId={data.server.id}
					/>
				)}

				<ChannelDrawerMobile
					channels={data?.channels ?? []}
					server={data?.server!}
				/>

				<ChannelList channels={data?.channels ?? []} server={data.server} />
			</div>
			{isLoaded && isSignedIn && (
				<div className='sticky !bottom-0 left-0 flex min-h-16 w-full items-center bg-[#232428] px-3 text-white'>
					{isLoaded && isSignedIn && (
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
					)}
				</div>
			)}
		</ul>
	);
}
