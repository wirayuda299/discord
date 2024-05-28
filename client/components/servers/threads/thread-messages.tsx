import Image from 'next/image';
import { X } from 'lucide-react';
import {  useSearchParams } from 'next/navigation';
import { ReactNode, memo, useCallback, useEffect, useRef } from 'react';

import { Sheet, SheetContent, SheetTrigger } from '../../ui/sheet';
import ChatForm from '../../shared/messages/chat-form';
import ChatItem from '../../shared/messages/chat-item';

import { ServerStates } from '@/providers/server';
import useScroll from '@/hooks/useScroll';
import { Message, Thread } from '@/types/messages';
import {  Servers } from '@/types/server';
import { useSocket } from '@/providers/socket-io';
import { Channel } from '@/types/channels';

type Props = {
	thread: Thread | null;
	children: ReactNode;
	selectedChannel: Channel | null;
	selectedMessage: {
		type: 'personal' | 'thread' | 'channel' | 'reply';
		message: Message;
		action: string;
	} | null;
	selectedThread: Thread | null;
	selectedServer: Servers | null;
	setStates: (value: Partial<ServerStates>) => void;
};

function ThreadMessages({
	thread,
	selectedChannel,
	selectedMessage,
	selectedServer,
	selectedThread,
	setStates,
	children,
}: Props) {
	const searchParams = useSearchParams();
	const ref = useRef<HTMLUListElement>(null);

	const { states } = useSocket();

	const reloadThreadMessages = useCallback(() => {
		if (!states.socket || !selectedServer || !thread) return;

		states.socket?.emit('thread-messages', {
			threadId: thread?.thread_id,
			serverId: selectedServer.id,
			channelId: selectedChannel?.channel_id,
		});
	}, [states.socket, selectedServer, thread, selectedChannel?.channel_id]);

	useEffect(() => {
		reloadThreadMessages();
	}, [reloadThreadMessages, thread?.thread_id]);

	useScroll(ref, states.thread_messages);


	return (
		<Sheet
			modal={false}
			onOpenChange={(isOpen) => {
				if (!isOpen) {
					setStates({
						selectedMessage: null,
						selectedThread: null,
					});
				} else {
					reloadThreadMessages();
				}
			}}
		>
			<SheetTrigger asChild>{children}</SheetTrigger>
			<SheetContent
				side='right'
				className='flex h-screen flex-col justify-between overflow-y-auto border-l-2 border-none border-l-foreground bg-black p-0 shadow-2xl md:bg-background'
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
						{states?.thread_messages?.map((message) => (
							<ChatItem
								selectedChannel={selectedChannel}
								selectedMessage={selectedMessage}
								selectedServer={selectedServer}
								selectedThread={selectedThread}
								reloadMessages={reloadThreadMessages}
								setStates={setStates}
								replyType='thread'
								messages={states.thread_messages}
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
							<button
								className='flex size-5 items-center justify-center rounded-full bg-gray-2'
								onClick={() => setStates({ selectedMessage: null })}
							>
								<X size={15} className='mx-auto text-gray-1' />
							</button>
						</div>
					)}
						<ChatForm
							reloadMessage={reloadThreadMessages}
							placeholder='Send message'
							type='thread'
						/>
				</div>
			</SheetContent>
		</Sheet>
	);
}

export default memo(ThreadMessages);
