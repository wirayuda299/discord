'use client';

import { Search } from 'lucide-react';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';

import ServerDrawerMobile from './ServerMobile';
import AddUserDrawer from './add-user';
import ChannelList from '../channels/list';
import { useServerContext } from '@/providers/server';
import { getServerById } from '@/actions/server';

export default function ChannelDrawerMobile() {
	const params = useParams();
	const { selectedChannel } = useServerContext();
	const selectedServer =
		typeof window !== 'undefined' ? localStorage.getItem(params.slug[1]) : '';
	const { data, mutate, isLoading, error } = useSWR(
		'/server/' + params.slug[1],
		async () =>
			params.slug[1]
				? await getServerById(params.slug[1] as string)
				: await getServerById(selectedServer!!)
	);

	if (!params.slug.includes('server') && !selectedChannel) return null;
	if (!data?.server) return null;

	return (
		<aside className='border-foreground h-screen min-w-[260px] flex-col gap-3 overflow-y-auto border-r-2 bg-[#0c0d0e] px-3 pb-12 pt-3 md:hidden md:bg-[#2b2d31]'>
			{isLoading && <p>Loading...</p>}
			{error && <p>Error</p>}
			{!isLoading && (
				<>
					<>
						<header className='border-b-foreground flex items-center gap-1 border-b-2 pb-3'>
							<h2 className='text-base font-semibold text-white'>
								{data?.server[0]?.name}
							</h2>
							<ServerDrawerMobile server={data?.server[0]} mutate={mutate} />
						</header>
						<div className='flex w-full items-center gap-2'>
							<form className=' w-[calc(100%-30px)]'>
								<div className='bg-background mt-2 flex justify-between gap-2 rounded-md p-1'>
									<button>
										<Search stroke='#fff' size={18} />
									</button>
									<input
										type='search'
										placeholder='Search...'
										className='w-full bg-transparent'
									/>
								</div>
							</form>
							<AddUserDrawer styles='pt-2' />
						</div>
					</>
					<>
						{data && (
							<Suspense fallback='loading...'>
								<ChannelList
									mutate={mutate}
									channels={data?.channels}
									server={data?.server[0]}
								/>
							</Suspense>
						)}
					</>
				</>
			)}
		</aside>
	);
}
