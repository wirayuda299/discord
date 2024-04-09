'use client';

import useSWR from 'swr';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';

import { serverSidebarLinks } from '@/constants/sidebarLinks';
import ServerSidebarLinkItem from './server-sidebar-links';
import ChannelList from '../channels/list';
import { cn } from '@/lib/utils';
import { Servers } from '@/types/server';
import ServerMenu from '../server-menus';
import { getServerById } from '@/helper/server';

export default function ServerSidebar() {
	const params = useParams();
	const { user, isLoaded, isSignedIn } = useUser();

	const { data, mutate, isLoading, error } = useSWR(
		'/server/' + params.slug[1],
		async () => {
			return params.slug && params.slug[1]
				? getServerById(params.slug[1] as string)
				: null;
		}
	);

	if (error) return <p>{error.message}</p>;

	return (
		<ul
			className={cn(
				'min-w-[255px] relative flex-col gap-3 border-r-2 border-r-foreground  md:flex md:bg-[#2b2d31] h-screen overflow-y-auto',
				data ? 'hidden md:flex' : 'flex'
			)}
		>
			{!isLoading && (
				<ServerMenu
					serverName={(data && data?.server?.[0].name) || ''}
					mutate={mutate}
					serverId={(data && data?.server?.[0].id) || ''}
				/>
			)}
			<form className='my-3 w-full md:hidden'>
				<input
					type='search'
					className='bg-foreground w-full rounded-md py-1 pl-2 placeholder:text-xs'
					placeholder='Find or start conversation '
				/>
			</form>

			{serverSidebarLinks.map((item) => (
				<ServerSidebarLinkItem {...item} key={item.label} />
			))}
			{isLoading ? (
				[1, 2, 3, 4].map((c) => (
					<div key={c} className='bg-background/25 h-8 w-full rounded-md'></div>
				))
			) : (
				<Suspense
					fallback={
						<div className='bg-secondary h-4 w-full rounded-full'></div>
					}
				>
					<ChannelList
						channels={data?.channels ?? []}
						server={data && data.server && (data.server[0] as Servers)}
						mutate={mutate}
					/>
				</Suspense>
			)}
			<div
				className={cn(
					'absolute bottom-0 left-0 h-16 flex items-center w-full bg-black/40 px-3 text-white',
					(!isLoaded || !isSignedIn) && 'animate-pulse'
				)}
			>
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
							<p className='text-gray-2 text-xs'>invisible</p>
						</div>
					</div>
				)}
			</div>
		</ul>
	);
}
