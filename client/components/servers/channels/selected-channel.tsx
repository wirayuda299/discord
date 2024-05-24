'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { MoveLeft } from 'lucide-react';
import Image from 'next/image';
import { Suspense, memo, useCallback, useMemo, useRef } from 'react';

import { cn } from '@/lib/utils/mergeStyle';

import ChatForm from '@/components/shared/messages/chat-form';
import ChatItem from '@/components/shared/messages/chat-item';
import SearchForm from '../../shared/search-form';
import { useServerContext } from '@/providers/server';
import useSocket from '@/hooks/useSocket';
import useScroll from '@/hooks/useScroll';
import { Message } from '@/types/messages';
import { findBannedMembers } from '@/utils/banned_members';

const Inbox = dynamic(() => import('../../shared/inbox'), { ssr: false });
const PinnedMessage = dynamic(
	() => import('@/components/shared/messages/pinned-message'),
	{ ssr: false }
);
const MemberSheet = dynamic(() => import('../members/members'), { ssr: false });
const NotificationSettings = dynamic(() => import('./notification-settings'), {
	ssr: false,
});
const Thread = dynamic(() => import('./threads'), { ssr: false });
const ChanelInfo = dynamic(
	() => import('@/components/servers/channels/channel-info'),
	{ ssr: false }
);

function SelectedChannel() {
	const ref = useRef<HTMLUListElement>(null);

	const { serversState, setServerStates } = useServerContext();
	const { reloadChannelMessage, states, socket, params, searchParams, userId } =
		useSocket();
	const { selectedChannel } = serversState;


	const isCurrentUserBanned = useMemo(() =>findBannedMembers(states.banned_members, userId!), [states.banned_members, userId]
	)

	const handleBackClick = useCallback(() => setServerStates((prev) => ({ ...prev, selectedChannel: null })), [setServerStates]);

	useScroll(ref, states.channel_messages);
	

	return (
		<div
			className={cn(
				'fixed md:static transition-all ease-out duration-300 top-0 md:z-0 z-40 md:h-screen h-dvh overflow-y-auto overflow-x-hidden bg-black md:bg-background w-full',
				serversState.selectedChannel ? 'right-0' : '-right-full'
			)}
		>
			<header className='flex min-h-14 w-full items-center justify-between border-b-2 border-b-foreground p-2 '>
				<div className='flex items-center gap-3'>
					<Link
						aria-label='Go back'
						href={'/server/' + params.serverId}
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
							{serversState.selectedChannel?.channel_name}
						</h3>
						<div className='md:hidden'>
							<ChanelInfo />
						</div>
					</div>
				</div>
				<div className='hidden items-center gap-4 md:flex'>
					<Suspense
						fallback={
							<div className='aspect-square h-6 w-12 rounded-md bg-background brightness-110'></div>
						}
					>
						<Thread
							channelId={params.channelId as string}
							serverId={params.serverId as string}
						/>
					</Suspense>
					<NotificationSettings />

					<PinnedMessage channelId={params.channelId as string} />

					<MemberSheet
						userId={userId!!}
						serverId={params.serverId as string}
						selectedServer={serversState.selectedServer}
					/>
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
			<div className='flex h-[calc(100vh-120px)] max-w-full flex-col'>
				<ul
					className='ease flex min-h-full flex-col gap-5 overflow-y-auto p-2 transition-all duration-500 md:p-5'
					ref={ref}
				>
					{states.channel_messages?.map((msg: Message) => (
						<ChatItem
							channelId={(params?.channelId as string) || ''}
							setServerStates={setServerStates}
							socketStates={states}
							replyType='channel'
							reloadMessage={() =>
								reloadChannelMessage(
									params.channelId as string,
									params.serverId as string
								)
							}
							socket={socket}
							serverStates={serversState}
							messages={states.channel_messages}
							userId={userId!!}
							msg={msg}
							key={msg.message_id}
						/>
					))}
				</ul>
				{!isCurrentUserBanned ? (
					<ChatForm
						socketStates={states}
						socket={socket}
						type='channel'
						params={params}
						searchParams={searchParams}
						userId={userId!!}
						reloadMessage={() =>
							reloadChannelMessage(
								params.channelId as string,
								params.serverId as string
							)
						}
						setServerStates={setServerStates}
						serverStates={serversState}
						placeholder={`Message #${selectedChannel?.channel_name}`}
					/>
				) : (
					<p className='text-center text-red-600'>You are banned </p>
				)}
			</div>
		</div>
	);
}

export default memo(SelectedChannel);
