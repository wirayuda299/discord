import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useRef, useMemo, ReactNode } from 'react';
import { useAuth } from '@clerk/nextjs';

import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { addLabelsToMessages } from '@/utils/messages';
import ChatForm from '../messages/chat-form';
import ChatItem from '../messages/chat-item';

import useSocket from '@/hooks/useSocket';
import { useServerContext } from '@/providers/server';
import useScroll from '@/hooks/useScroll';

type Props = {
	threadId: string;
	username: string;
	children: ReactNode;
};

export default function ThreadMessages({ threadId, children }: Props) {
	const { userId } = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	const { states, reloadThreadMessages, socket } = useSocket();
	const { serversState, setServerStates } = useServerContext();
	const { selectedServer, selectedChannel, selectedMessage } = serversState;

	const messageRef = useRef<HTMLDivElement>(null);
	const path = `/server/${selectedServer?.id}/${selectedChannel?.channel_id}?channel_type=${selectedChannel?.channel_type}`;

	const threadMessage = useMemo(
		() => addLabelsToMessages(states.thread_messages),
		[states.thread_messages]
	);

	useScroll(messageRef, threadMessage);

	return (
		<Sheet
			onOpenChange={(isOpen) => {
				if (isOpen) {
					reloadThreadMessages(threadId);
				} else {
					router.push(path);
				}
			}}
		>
			<SheetTrigger asChild>{children}</SheetTrigger>
			<SheetContent
				side='right'
				className='flex h-screen flex-col justify-between overflow-y-auto border-l-2 border-none border-l-foreground bg-black p-0 md:bg-background'
				ref={messageRef}
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
								{threadMessage?.[0]?.thread_name}
							</span>
						</h3>
					</header>
					<ul
						className='flex h-auto w-full flex-col gap-5 overflow-y-auto p-3'
					>
						{threadMessage?.map((message) => (
							<ChatItem
								replyType='thread'
								reloadMessage={() => reloadThreadMessages(threadId)}
								socket={socket}
								serverStates={serversState}
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
									{selectedMessage.username}
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
					<ChatForm
						path={path}
						placeholder='Send message'
						reloadMessage={() =>
							reloadThreadMessages(searchParams.get('threadId') as string)
						}
						serverStates={serversState}
						setServerStates={setServerStates}
						socket={socket}
						type='thread'
					/>
				</div>
			</SheetContent>
		</Sheet>
	);
}
