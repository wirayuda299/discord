import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import {
	Dispatch,
	ReactNode,
	SetStateAction,
	memo,
	useEffect,
	useMemo,
	useRef,
} from 'react';

import { Sheet, SheetContent, SheetTrigger } from '../../ui/sheet';
import ChatForm from '../../shared/messages/chat-form';
import ChatItem from '../../shared/messages/chat-item';

import { ServerStates } from '@/providers/server';
import useScroll from '@/hooks/useScroll';
import { Thread } from '@/types/messages';
import { Permission } from '@/types/server';
import { BannedMembers } from '@/types/socket-states';
import { useSocketContext } from '@/providers/socket-io';

type Props = {
	thread: Thread;
	children: ReactNode;
	serversState: ServerStates;
	setServerStates: Dispatch<SetStateAction<ServerStates>>;
	isCurrentUserBanned: false | BannedMembers | undefined;
	permissions: Permission | undefined;
};

function ThreadMessages({
	thread,
	permissions,
	isCurrentUserBanned,
	serversState,
	setServerStates,
	children,
}: Props) {
	const ref = useRef<HTMLUListElement>(null);
	const { selectedChannel, selectedMessage, selectedThread } = serversState;
	const { states, params, searchParams, reloadThreadMessages } = useSocketContext();

	useEffect(() => {
		reloadThreadMessages(thread.thread_id)
	}, [reloadThreadMessages, thread.thread_id])


	const messages = useMemo(
		() => states.thread_messages,
		[states.thread_messages]
	);

	useScroll(ref, states.thread_messages);

	const path = `/server/${params?.serverId}/${params.channelId}?channel_type=${selectedChannel?.channel_type}`;

	return (
		<Sheet
			modal={false}
			onOpenChange={(isOpen) => {
				if (!isOpen) {
					setServerStates((prev) => ({
						...prev,
						selectedThread: null,
						selectedMessage: null,
					}));
				} else {
					reloadThreadMessages(thread.thread_id);
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
						{messages?.map((message) => (
							<ChatItem
								serversState={serversState}
								setServerStates={setServerStates}
								isCurrentUserBanned={isCurrentUserBanned}
								permissions={permissions}
								replyType='thread'
								messages={messages}
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
							placeholder='Send message'
							serverStates={serversState}
							setServerStates={setServerStates}
							type='thread'
						/>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}

export default memo(ThreadMessages);
