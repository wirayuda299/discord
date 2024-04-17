'use client';

import { MoveLeft } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@clerk/nextjs';

import { useServerContext } from '@/providers/server';
import { cn } from '@/lib/utils';
import ChanelInfo from '../drawer/channel-info';
import Thread from './threads';
import NotificationSettings from './notification-settings';
import PinnedMessage from '../messages/pinned-message';
import Inbox from './inbox';
import MemberSheet from './members';
import ChatLoader from '../loader/chat-loader';
import { addLabelsToMessages, groupReactionsByEmoji } from '@/utils/messages';
import ChatForm from '../messages/chat-form';
import ChatItem from '../messages/chat-item';
import { useSocketContext } from '@/providers/socket-io';
import useSwipe from '@/hooks/useSwipe';
import useSocket from '@/hooks/useSocket';

export default function SelectedChannel() {
	const params = useParams();
	const router = useRouter();
	const { userId } = useAuth();
	const { serversState, setServerStates } = useServerContext();
	const { channelMessages, socket, setChannelMessages } = useSocketContext();
	const { onTouchEnd, onTouchMove, onTouchStart } = useSwipe(setServerStates);
	useSocket(socket, params, setChannelMessages);

	useEffect(() => {
		setServerStates((prev) => ({
			...prev,
			selectedMessage: null,
		}));
	}, [serversState.selectedChannel]);

	const messageList = useMemo(
		() => addLabelsToMessages(channelMessages),
		[channelMessages]
	);

	return (
		<div
			onTouchStart={onTouchStart}
			onTouchMove={onTouchMove}
			onTouchEnd={onTouchEnd}
			className={cn(
				'fixed md:static transition-all ease-out duration-300 top-0 md:z-0 z-40 h-screen overflow-y-auto overflow-x-hidden bg-black md:bg-background border-l-2 border-l-foreground w-full',
				serversState.selectedChannel
					? 'right-0'
					: '-right-[calc(100%-20px)] md:hidden'
			)}
		>
			<header className='border-b-foreground flex min-h-14 w-full items-center justify-between border-b-2 p-2 '>
				<div className='flex items-center gap-3'>
					<button
						className='md:hidden'
						onClick={() => {
							router.push('/server/' + params.slug[1]);
							setServerStates((prev) => ({
								...prev,
								selectedChannel: null,
							}));
						}}
					>
						<MoveLeft className='text-gray-2' />
					</button>
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
				<div className='hidden items-center gap-4 lg:flex'>
					<Thread />
					<NotificationSettings />
					<PinnedMessage
						channelId={serversState.selectedChannel?.channel_id!!}
					/>
					<MemberSheet selectedServer={serversState.selectedServer} />
					<form action=''>
						<label
							htmlFor='search'
							className='bg-foreground flex max-w-40 items-center rounded px-2 py-0.5'
						>
							<input
								type='search'
								id='search'
								className='w-full bg-transparent placeholder:text-sm'
								placeholder='Search'
							/>
							<Image
								src={'/icons/search.svg'}
								width={20}
								height={20}
								alt={'hashtag'}
								key={'hashtag'}
							/>
						</label>
					</form>
					<Inbox />
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
				<ul className='flex min-h-full flex-col gap-5 overflow-y-auto p-5'>
					{!messageList
						? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => <ChatLoader key={c} />)
						: messageList.length >= 1 &&
							groupReactionsByEmoji(messageList)?.map((msg) => (
								<ChatItem
									serverStates={serversState}
									messages={channelMessages}
									setServerStates={setServerStates}
									channelId={serversState.selectedChannel?.channel_id!!}
									userId={userId!!}
									msg={msg}
									key={msg.reply_id ? msg.reply_id : msg.message_id}
									serverId={params.slug[1]}
								/>
							))}
				</ul>

				<ChatForm
					serverStates={serversState}
					setServerStates={setServerStates}
				/>
			</div>
		</div>
	);
}
