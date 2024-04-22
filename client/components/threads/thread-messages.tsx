import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useRef, useMemo, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@clerk/nextjs';

import { formUrlQuery } from '@/utils/form-url-query';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { useSocketContext } from '@/providers/socket-io';
import {
	addLabelsToMessages,
	foundMessage,
  handleSelectedMessage,
} from '@/utils/messages';
import EmojiPickerButton from '../messages/emoji-picker';
import { useServerContext } from '@/providers/server';
import ChatLabel from '../messages/chat-label';
import ChatContent from '../messages/chat-content';
import { Message } from '@/types/messages';
import { replyThread } from '@/actions/threads';
import { createError } from '@/utils/error';
import useEmoji from '@/hooks/useEmoji';
import useScroll from '@/hooks/useScroll';

type Props = {
	threadId: string;
	username: string;
	children: ReactNode;
};

export default function ThreadMessages({
	threadId,
	children,
	username,
}: Props) {
  const ref = useRef<HTMLInputElement | null>(null);
  const messageRef = useRef<HTMLDivElement>(null)
	const searchParams = useSearchParams();
  const router = useRouter();
	const { userId } = useAuth();
  const { socket } = useSocketContext();
	const [messages, setMessages] = useState<Message[]>([]);
  const { serversState, setServerStates } = useServerContext();
  const {selectedServer, selectedChannel, selectedMessage}= serversState
  
	const handleAppendOrRemoveEmoji = useEmoji(
		serversState.selectedServer?.id!!,
		userId!!,
		reloadMessages
  );
  

	useEffect(() => {
		if (!socket) return;

		reloadMessages()
		socket.on('set-thread-messages', (data) => {
			setMessages(data);
		});

		return () => {
			setMessages([]);
			setServerStates((prev) => ({
				...prev,
				selectedMessage: null,
			}));
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ selectedServer?.id!!, setServerStates, socket, threadId]);

	async function sendMessage(data: FormData) {
		const type = searchParams.get('type');
		const messageId = serversState.selectedMessage?.message_id;

		if (!userId) return;

		try {
			switch (type) {
				case 'threads':
					await replyThread({
						content: data.get('message') as string,
						imageAssetId: '',
						imageUrl: '',
						messageId: messageId || '',
						userId,
						threadId,
					});
					reloadMessages()
					break;
				case 'message':
					socket?.emit('message', {
						content: data.get('message'),
						is_read: false,
						user_id: userId,
						username,
						image_url: '',
						image_asset_id: '',
						type: 'thread',
						threadId,
					});
				reloadMessages()
					break;
				default:
					throw new Error('Invalid action', { cause: 'invalid type' });
			}
		} catch (error) {
			createError(error);
		} finally {
			if (ref.current) {
				ref.current.value = '';
			}
		}
	}

	const threadMessage = useMemo(
		() => addLabelsToMessages(messages),
		[messages]
	);
  useScroll(messageRef, threadMessage);

	function reloadMessages() {
		if (socket) {
			socket.emit('thread-messages', {
				threadId,
				serverId: selectedServer?.id,
			});
		}
	}

	const appendEmoji = (e: any) => {
		if (ref.current) {
			ref.current += e.emoji;
		}
	};

	return (
		<Sheet
			onOpenChange={(isOpen) => {
				if (isOpen) {
				reloadMessages()
				} else {
					router.push(formUrlQuery(searchParams.toString(), 'type', null)!);
				}
			}}
		>
			<SheetTrigger asChild>{children}</SheetTrigger>
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
							<span className='text-sm text-gray-2'>
								{threadMessage?.[0]?.thread_name}
							</span>
						</h3>
					</header>
					<div className='flex w-full h-auto flex-col gap-5 overflow-y-auto p-3' ref={messageRef}>
						{threadMessage?.map((message) => {
							const repliedMessage = foundMessage(threadMessage, message);
							return (
								<div key={message.message_id}>
									{message.shouldAddLabel && (
										<ChatLabel createdAt={message.created_at} />
									)}
									{message.parent_message_id && (
										<Link
											href={`#${message.message_id}`}
											className='group flex w-auto items-center pl-5'
										>
											<Image
												className='mt-2 aspect-auto min-w-8 object-contain'
												src='/icons/connected-line.svg'
												width={20}
												height={20}
												alt='line'
											/>

											<div className='flex w-full gap-2 overflow-x-hidden md:max-w-[200px] lg:max-w-[500px] '>
												<div className='flex min-h-4 min-w-4 items-center justify-center rounded-full bg-foreground'>
													<svg width='10' height='10' viewBox='0 0 12 8'>
														<path
															d='M0.809739 3.59646L5.12565 0.468433C5.17446 0.431163 5.23323 0.408043 5.2951 0.401763C5.35698 0.395482 5.41943 0.406298 5.4752 0.432954C5.53096 0.45961 5.57776 0.50101 5.61013 0.552343C5.64251 0.603676 5.65914 0.662833 5.6581 0.722939V2.3707C10.3624 2.3707 11.2539 5.52482 11.3991 7.21174C11.4028 7.27916 11.3848 7.34603 11.3474 7.40312C11.3101 7.46021 11.2554 7.50471 11.1908 7.53049C11.1262 7.55626 11.0549 7.56204 10.9868 7.54703C10.9187 7.53201 10.857 7.49695 10.8104 7.44666C8.72224 5.08977 5.6581 5.63359 5.6581 5.63359V7.28135C5.65831 7.34051 5.64141 7.39856 5.60931 7.44894C5.5772 7.49932 5.53117 7.54004 5.4764 7.5665C5.42163 7.59296 5.3603 7.60411 5.29932 7.59869C5.23834 7.59328 5.18014 7.57151 5.13128 7.53585L0.809739 4.40892C0.744492 4.3616 0.691538 4.30026 0.655067 4.22975C0.618596 4.15925 0.599609 4.08151 0.599609 4.00269C0.599609 3.92386 0.618596 3.84612 0.655067 3.77562C0.691538 3.70511 0.744492 3.64377 0.809739 3.59646Z'
															fill='#B5BAC1'
														></path>
													</svg>
												</div>
												<h6 className='text-sm text-gray-2 group-hover:brightness-150'>
													{repliedMessage?.username}
												</h6>
												<div className='flex gap-2 overflow-hidden'>
													<span className='truncate text-sm text-gray-2 group-hover:brightness-150'>
														{repliedMessage?.message}
													</span>
												</div>
											</div>
										</Link>
									)}
									<ChatContent
										threadId={threadId}
										socket={socket}
										handleSelectedMessage={() =>
											handleSelectedMessage(
												message,
												router,
												searchParams,
												setServerStates,
												'threads'
											)
										}
										handleClick={(e) =>
											handleAppendOrRemoveEmoji(e, message.message_id)
										}
										message={message}
										serverStates={serversState}
										setServerStates={setServerStates}
										userId={userId!!}
									/>
								</div>
							);
						})}
					</div>
				</div>
				<div className=' sticky bottom-0 flex w-full flex-col justify-end p-3'>
					{selectedMessage &&
						searchParams.get('type') === 'threads' && (
							<div className='flex w-full items-center justify-between rounded-t-xl bg-[#2b2d31] p-2'>
								<p className='bottom-16 text-sm text-gray-2'>
									Replying to{' '}
									<span className='font-semibold text-gray-2 brightness-150'>
										{selectedMessage.username}
									</span>
								</p>
								<Link
									href={`/server/${selectedServer?.id}/${selectedChannel?.channel_id}`}
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
					<form action={sendMessage} className='flex w-full'>
						<div className='flex w-full rounded bg-foreground p-2'>
							<input
								type='text'
								ref={ref}
								required
								min={1}
								minLength={1}
								name='message'
								autoComplete='off'
								placeholder='Send message'
								className='flex min-h-[30px] w-full  break-before-auto  items-center whitespace-pre-wrap break-all  !border-none bg-transparent text-sm font-light text-white caret-white outline-none brightness-110 focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:animate-pulse '
							/>
							<EmojiPickerButton handleClick={appendEmoji} />
						</div>
					</form>
				</div>
			</SheetContent>
		</Sheet>
	);
}
