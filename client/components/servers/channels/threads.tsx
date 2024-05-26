import Image from 'next/image';
import { Dispatch, SetStateAction, memo } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getAllThreads } from '@/helper/threads';
import useFetch from '@/hooks/useFetch';
import ThreadMessages from '../threads/thread-messages';
import usePermissions from '@/hooks/usePermissions';
import { ServerStates } from '@/providers/server';

function Thread({
	serversState,
	setServerStates,
}: {
	serversState: ServerStates;
	setServerStates: Dispatch<SetStateAction<ServerStates>>;
}) {
	const { userId } = useAuth();
	const params = useParams();

	const { data, isLoading, error, mutate } = useFetch('all-threads', () =>
		getAllThreads(params.channel_id as string, params.id as string)
	);
	const { isCurrentUserBanned, permissions, loading, isError } = usePermissions(
		userId!!,
		params.id as string
	);

	if (error || isError) return null;

	return (
		<DropdownMenu
			onOpenChange={(isOpen) => {
				isOpen && mutate();
			}}
		>
			<DropdownMenuTrigger>
				<Image
					className='min-w-6'
					src={'/icons/threads.svg'}
					width={24}
					height={24}
					alt={'threads'}
					key={'threads'}
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent className=' border-none bg-background p-0'>
				<header className='flex min-h-6 w-full items-center  gap-3 bg-foreground p-2 text-white'>
					<div className='flex items-center gap-2 border-r border-r-background pr-5'>
						<Image
							src={'/icons/threads.svg'}
							width={24}
							height={24}
							alt={'threads'}
							key={'threads'}
						/>
						<h3 className='text-base font-semibold'>Threads</h3>
					</div>
				</header>
				<div className='flex max-h-48 w-full min-w-56 flex-col gap-2 overflow-y-auto p-2'>
					{isLoading || loading ? (
						<div className='flex flex-col gap-3'>
							{[1, 2, 3, 4].map((l) => (
								<div
									key={l}
									className='h-7 w-full animate-pulse bg-background brightness-110'
								></div>
							))}
						</div>
					) : (
						data?.map((thread) => (
							<ThreadMessages
								key={thread.thread_id}
								isCurrentUserBanned={isCurrentUserBanned}
								permissions={permissions}
								serversState={serversState}
								thread={thread}
								setServerStates={setServerStates}
							>
								<div
									key={thread.thread_id}
									className='cursor-pointer p-1 text-gray-2 hover:bg-background hover:brightness-110'
								>
									<h4 className='text-sm font-semibold text-white '>
										{thread.thread_name}
									</h4>
									<div className='flex items-center gap-2'>
										<Image
											// @ts-ignore
											src={thread.avatar}
											width={10}
											height={10}
											alt='author'
											className='size-3 rounded-full object-cover'
										/>
										<p className='text-sm'>Started by {thread.username}</p>
									</div>
								</div>
							</ThreadMessages>
						))
					)}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default memo(Thread);
