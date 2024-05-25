import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import {  memo, useMemo, useEffect, useRef } from 'react';

import { Sheet, SheetContent, SheetTrigger } from '../../ui/sheet';
import ChatForm from '../../shared/messages/chat-form';
import ChatItem from '../../shared/messages/chat-item';

import useSocket from '@/hooks/useSocket';
import { useServerContext } from '@/providers/server';
import useScroll from '@/hooks/useScroll';
import usePermissions from '@/hooks/usePermissions';
import { Thread } from '@/types/messages';

type Props = {
	thread:Thread
	selectThread: (thread:Thread) => void;
};

function ThreadMessages({  selectThread, thread }: Props) {
	const ref = useRef<HTMLUListElement>(null);

	const { states, reloadThreadMessages, socket, userId, searchParams, params } =
		useSocket();
	const { serversState, setServerStates } = useServerContext();
	const { selectedServer, selectedChannel, selectedMessage, selectedThread } =
		serversState;

	const messages = useMemo(
		() => states.thread_messages,
		[states.thread_messages]
	);

	const { isCurrentUserBanned, loading, isError, permissions } = usePermissions(
		userId,
		serversState?.selectedServer?.id!!
	);

	useScroll(ref, messages);

	useEffect(() => {
		reloadThreadMessages(thread.thread_id);
	}, [reloadThreadMessages, thread]);

	const path = `/server/${selectedServer?.id}/${selectedChannel?.channel_id}?channel_type=${selectedChannel?.channel_type}`;

	if (loading || isError) return null;

	return (
		<Sheet
			onOpenChange={(isOpen) => {
				if (!isOpen) {
					setServerStates((prev) => ({
						...prev,
						selectedThread: null,
						selectedMessage: null,
					}));
				}
			}}
		>
			<SheetTrigger
				onClick={() => selectThread(thread)}
				className='flex cursor-pointer items-center gap-3 text-gray-2 brightness-125'
			>
		
					<Image
						src={'/icons/threads.svg'}
						width={15}
						height={15}
						alt={'threads'}
					/>
					<p className='text-sm'>
						<span className='font-medium text-white'>{thread.username}</span>{' '}
						started a thread:{' '}
						<span className='text-white'>{thread.thread_name}</span>
					</p>
			</SheetTrigger>
			<SheetContent
				side='right'
				className='flex h-screen flex-col justify-between overflow-y-auto border-l-2 border-none border-l-foreground bg-black p-0 md:bg-background'
			>
				<div className='w-full '>
					<header className='sticky top-0 z-10 flex w-full items-center gap-4 border-b border-b-foreground bg-black p-4 md:bg-background'>
						<Image
							src={'/icons/threads.svg'}
							width={25}
							height={25}
							alt='threads'
						/>
						<h3 className='text-base font-semibold text-gray-2'>
							Thread -{' '}
							<span className=' uppercase text-gray-2'>
								{selectedThread?.thread_name}
							</span>
						</h3>
					</header>
					<ul
						className='flex h-auto w-full flex-col gap-5 overflow-y-auto p-3'
						ref={ref}
					>
						{messages?.map((message) => (
							<ChatItem
								isCurrentUserBanned={isCurrentUserBanned}
								permissions={permissions}
								serverId={params.serverId as string}
								channelId={params.channelId as string}
								replyType='thread'
								reloadMessage={() => reloadThreadMessages(thread.thread_id)}
								messages={states.thread_messages}
								userId={userId!!}
								msg={message}
								key={message.message_id}
							/>
						))}
					</ul>
				</div>
				<div className=' sticky bottom-0 flex w-full flex-col justify-end backdrop-blur-md'>
					{selectedMessage && searchParams.get('type') === 'reply' && (
						<div className='flex w-full items-center justify-between rounded-t-xl bg-[#2b2d31] p-2'>
							<p className='bottom-16 text-sm text-gray-2'>
								Replying to{' '}
								<span className='font-semibold text-gray-2 brightness-150'>
									{selectedMessage.message && selectedMessage.message.username}
								</span>
							</p>
							<Link
								href={path}
								className='flex size-5 items-center justify-center rounded-full bg-gray-2'
								onClick={() => {
									setServerStates((prev) => ({
										...prev,
										selectedMessage: null,
									}));
								}}
							>
								<X size={15} className='mx-auto text-gray-1' />
							</Link>
						</div>
					)}
					{!isCurrentUserBanned && (
						<ChatForm
							socketStates={states}
							reloadMessage={() => reloadThreadMessages(thread.thread_id)}
							params={params}
							searchParams={searchParams}
							userId={userId!!}
							placeholder='Send message'
							serverStates={serversState}
							setServerStates={setServerStates}
							socket={socket}
							type='thread'
						/>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}

export default memo(ThreadMessages);
