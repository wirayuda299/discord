'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { MoveLeft } from 'lucide-react';
import Image from 'next/image';
import { Suspense, memo } from 'react';

import { cn } from '@/lib/utils/mergeStyle';

import SearchForm from '../../shared/search-form';
import { useServerContext } from '@/providers/server';

const ChannelMessages = dynamic(() => import('./channel-messages'));
const Inbox = dynamic(() => import('../../shared/inbox'));
const PinnedMessage = dynamic(
	() => import('@/components/shared/messages/pinned-message'),
);
const MemberSheet = dynamic(() => import('../members/members'));
const NotificationSettings = dynamic(() => import('./notification-settings'));
const Thread = dynamic(() => import('./threads'));
const ChanelInfo = dynamic(
	() => import('@/components/servers/channels/channel-info'),
);

function SelectedChannel({
	serverId,
	channelId,
}: {
	serverId: string;
	channelId: string;
}) {
	const { states, updateState } = useServerContext();

	const handleBackClick = () =>
		updateState( {selectedChannel: null });

	return (
		<div
			className={cn(
				'fixed md:static transition-all ease-out duration-300 top-0 md:z-0 z-40 md:h-screen h-dvh overflow-y-auto overflow-x-hidden bg-black md:bg-background w-full',
				states.selectedChannel ? 'right-0' : '-right-full'
			)}
		>
			<header className='flex min-h-14 w-full items-center justify-between border-b-2 border-b-foreground p-2 '>
				<div className='flex items-center gap-3'>
					<Link
						aria-label='Go back'
						href={'/server/' + serverId}
						className='block md:hidden'
						onClick={handleBackClick}
					>
						<MoveLeft className='text-gray-2' />
					</Link>
					<div className='flex items-center gap-1 '>
						<h3 className='text-md flex items-center gap-2 font-medium lowercase text-white'>
							<Image
								src={'/icons/hashtag.svg'}
								width={24}
								height={24}
								alt={'hashtag'}
								key={'hashtag'}
							/>
							{states.selectedChannel?.channel_name}
						</h3>
						<div className='md:hidden'>
							<ChanelInfo />
						</div>
					</div>
				</div>
				<div className='hidden items-center gap-4 md:flex'>
					<Thread
						selectedChannel={states.selectedChannel}
						selectedMessage={states.selectedMessage}
						selectedServer={states.selectedServer}
						selectedThread={states.selectedThread}
						setStates={updateState}
					/>
					<NotificationSettings />
					<PinnedMessage channelId={channelId as string} />
					<MemberSheet selectedServer={states.selectedServer} />
					<SearchForm />
					<Inbox>
						<p>channel notifications</p>
					</Inbox>
					<Image
						src={'/icons/ask.svg'}
						width={24}
						height={24}
						alt={'ask'}
						key={'ask'}
					/>
				</div>
			</header>
			<Suspense fallback={<p>Loading messages</p>}>
			<ChannelMessages />
			</Suspense>
		</div>
	);
}

export default memo(SelectedChannel);
