'use client';

import useSWR from 'swr';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';

import { serverSidebarLinks } from '@/constants/sidebarLinks';
import ServerSidebarLinkItem from './server-sidebar-links';
import { getServerById } from '@/actions/server';
import ChannelList from '../channels/list';
import { cn } from '@/lib/utils';

export default function ServerSidebar() {
	const params = useParams();

	const { data } = useSWR('/server/' + params.slug[1], () =>
		params.slug && params.slug[1]
			? getServerById(params.slug[1] as string)
			: null
	);

	return (
		<ul
			className={cn(
				'min-w-[255px] flex-col gap-3 p-3 border-r-2 border-r-foreground  md:flex md:bg-[#2b2d31] h-screen overflow-y-auto',
				data ? 'hidden md:flex' : 'flex'
			)}
		>
			<form className='my-3 w-full'>
				<input
					type='search'
					className='bg-foreground w-full rounded-md py-1 pl-2 placeholder:text-xs'
					placeholder='Find or start conversation '
				/>
			</form>
			{serverSidebarLinks.map((item) => (
				<ServerSidebarLinkItem {...item} key={item.label} />
			))}
			{data && (
				<Suspense
					fallback={
						<div className='bg-secondary h-4 w-full rounded-full'></div>
					}
				>
					<ChannelList channels={data?.channels} />
				</Suspense>
			)}
		</ul>
	);
}
