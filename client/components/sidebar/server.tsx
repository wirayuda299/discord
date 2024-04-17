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
import ServerMenu from '../channels/server-menus';
import { getServerById } from '@/helper/server';
import error from 'next/error';

export default function ServerSidebar(props) {
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

	if (error) return <p>{JSON.stringify(error)}</p>;
	console.log(props);

	return (
		<ul
			className={cn(
				'min-w-[255px] relative flex-col gap-3 border-r-2 border-r-foreground justify-between no-scrollbar md:flex md:bg-[#2b2d31] h-full min-h-screen overflow-y-auto',
				data ? 'hidden md:flex' : 'flex'
			)}
		>
			<div className='size-full'>
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
					<div className='mt-3 flex flex-col gap-5 p-3'>
						{[1, 2, 3, 4].map((c) => (
							<div
								key={c}
								className='bg-background/25 h-8 w-full rounded-md'
							></div>
						))}
					</div>
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
			</div>
			<div
				className={cn(
					'sticky !bottom-0 left-0 min-h-16 flex items-center w-full bg-[#232428] px-3 text-white',
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
