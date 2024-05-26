import Image from 'next/image';
import { ReactNode, Suspense, useState } from 'react';
import type { Socket } from 'socket.io-client';

import { Message } from '@/types/messages';
import { useServerContext } from '@/providers/server';
import ChatForm from '../../shared/messages/chat-form';
import { Sheet, SheetContent, SheetTrigger } from '../../ui/sheet';
import useSocket from '@/hooks/useSocket';

type Props = {
	message: Message;
	children: ReactNode;
	serverId: string;
	channelId: string;
	socket: Socket | null;
};

export default function CreateThread({
	message,
	socket,
	channelId,
	serverId,
	children,
}: Props) {
	const [threadName, setThreadName] = useState<string>('');
	const { serversState, setServerStates } = useServerContext();
	const { reloadChannelMessage, searchParams, params, userId, states } =
		useSocket();

	return (
		<Sheet
			modal={false}
			onOpenChange={(isOpen) => {
				if (!isOpen) {
					setServerStates((prev) => ({
						...prev,
						selectedMessage: null,
						selectedThread: null,
					}));
				}
			}}
		>
			<SheetTrigger asChild>{children}</SheetTrigger>
			<SheetContent side='right' className='border-none p-0'>
				<header className='flex w-full items-center gap-4 border-b border-b-foreground p-4'>
					<Image
						src={'/icons/threads.svg'}
						width={25}
						height={25}
						alt='threads'
					/>
					<h3 className='text-base font-semibold text-gray-2'>New Thread</h3>
				</header>
				<div className=' h-full  p-3'>
					<div className='mt-auto flex h-[calc(100%-50px)] w-full flex-col  justify-end gap-5'>
						<div className='flex size-14 items-center justify-center rounded-full bg-background brightness-125'>
							<Image
								src={'/icons/threads.svg'}
								width={30}
								height={30}
								alt='threads'
							/>
						</div>
						<div>
							<h4 className='py-3 text-xs font-semibold uppercase text-gray-2'>
								Thread name
							</h4>

							<input
								required
								defaultValue={threadName}
								value={threadName}
								onChange={(e) => setThreadName(e.target.value)}
								type='text'
								placeholder={message.message}
								className='w-full rounded bg-foreground py-2 pl-2 text-gray-2 caret-white placeholder:text-xs focus-visible:outline-none'
							/>
						</div>
						<div>
							<div className='flex flex-wrap gap-2'>
								<p className='inline-flex gap-x-1 text-nowrap pt-[3px] text-xs leading-snug text-gray-600'>
									{new Date(message.created_at).toLocaleString('en-US', {
										hour: 'numeric',
										hour12: true,
									})}
								</p>
								<div className='flex flex-wrap items-start gap-2'>
									<p className='text-sm leading-snug text-gray-2'>
										{message.username}
									</p>

									<p
										className='min-w-min text-wrap  text-sm text-[#d9dee1]'
										style={{
											wordWrap: 'break-word',
											wordBreak: 'break-all',
										}}
									>
										{message.message}
										{new Date(message.update_at) >
											new Date(message.created_at) && (
											<span className='text-xs text-gray-2'>(edited)</span>
										)}
									</p>
								</div>
							</div>
							{message.media_image && !message.parent_message_id && (
								<Suspense
									fallback={
										<div className='h-14 w-full animate-pulse rounded-md bg-background brightness-125'></div>
									}
								>
									<Image
										src={message.media_image}
										width={200}
										height={100}
										alt='media'
										className='ml-9 mt-3 aspect-auto rounded-md object-cover'
										loading='lazy'
									/>
								</Suspense>
							)}
						</div>

						<ChatForm
							socketStates={states}
							params={params}
							userId={userId!!}
							searchParams={searchParams}
							threadName={threadName}
							key={'thread-form'}
							placeholder={`Message #thread-name`}
							serverStates={serversState}
							reloadMessage={() => reloadChannelMessage(channelId, serverId)}
							setServerStates={setServerStates}
							socket={socket}
							type='thread'
						/>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
