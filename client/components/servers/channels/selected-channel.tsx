'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { MoveLeft } from 'lucide-react';
import Image from 'next/image';
import { Suspense, memo, useCallback, useMemo, useRef } from 'react';

import { cn } from '@/lib/utils/mergeStyle';

import ChatForm from '@/components/shared/messages/chat-form';
import ChatItem from '@/components/shared/messages/chat-item';
import SearchForm from './search-form';
import { useServerContext } from '@/providers/server';
import useSocket from '@/hooks/useSocket';
import useScroll from '@/hooks/useScroll';
import { Message } from '@/types/messages';

const Inbox = dynamic(() => import('./inbox'), { ssr: false });
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

	const path = useMemo(
		() =>
			`/server/${params?.id}/${params?.channel_id}?channel_type=${selectedChannel?.channel_type}`,
		[params, selectedChannel]
	);

	const handleBackClick = useCallback(() => {
		setServerStates((prev) => ({ ...prev, selectedChannel: null }));
	}, [setServerStates]);
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
						href={'/server/' + params.id}
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
							channelId={params.channel_id as string}
							serverId={params.id as string}
						/>
					</Suspense>
					<NotificationSettings />
					<Suspense
						fallback={
							<div className='aspect-square h-6 w-12 rounded-md bg-background brightness-110'></div>
						}
					>
						<PinnedMessage channelId={params.channel_id as string} />
					</Suspense>
					<Suspense
						fallback={
							<div className='aspect-square h-6 w-12 rounded-md bg-background brightness-110'></div>
						}
					>
						<MemberSheet
							serverId={params.id as string}
							selectedServer={serversState.selectedServer}
						/>
					</Suspense>
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
					{states.channel_messages.length >= 1 &&
						states.channel_messages?.map((msg: Message) => (
							<ChatItem
								params={params}
								searchParams={searchParams}
								replyType={'channel'}
								reloadMessage={() =>
									reloadChannelMessage(
										params.channel_id as string,
										params.id as string
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

				<ChatForm
					socket={socket}
					type='channel'
					reloadMessage={() =>
						reloadChannelMessage(
							selectedChannel?.channel_id!!,
							params.id as string
						)
					}
					setServerStates={setServerStates}
					path={path}
					serverStates={serversState}
					placeholder={`Message #${selectedChannel?.channel_name}`}
				/>
			</div>
		</div>
	);
}

export default memo(SelectedChannel);
