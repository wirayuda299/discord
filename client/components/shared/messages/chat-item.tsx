import Image from 'next/image';
import { memo, useMemo } from 'react';
import Link from 'next/link';
import type { Socket } from 'socket.io-client';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import queryString from 'query-string';

import ImagePreview from '../../modals/image-preview';
import { Message } from '@/types/messages';
import { ServerStates } from '@/providers/server';
import ThreadMessages from '../../threads/thread-messages';
import ChatLabel from './chat-label';
import ChatContent from './chat-content';
import { foundMessage } from '@/utils/messages';
import useEmoji from '@/hooks/useEmoji';

type Props = {
	socket: Socket | null;
	msg: Message & { shouldAddLabel?: boolean };
	userId: string;
	replyType: string;
	styles?: string;
	messages: Message[];
	serverStates: ServerStates;
	reloadMessage: () => void;
};

function ChatItem({
	msg,
	userId,
	messages,
	replyType,
	serverStates,
	socket,
	reloadMessage,
	styles,
}: Props) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const params = useParams();
	const { selectedServer } = serverStates;
	const handleAppendOrRemoveEmoji = useEmoji(
		selectedServer?.id!!,
		userId,
		reloadMessage
	);

	const getPath = (threadId: string) => {
		const parsed = queryString.parse(searchParams.toString());
		parsed.type = 'thread';
		parsed.threadId = threadId;
		return queryString.stringify(parsed);
	};

	const repliedMessage = useMemo(
		() => foundMessage(messages, msg),
		[messages, msg]
	);

	

	return (
		<li
			id={msg.message_id}
			className='scroll-mt-5 rounded-md p-1 target:!bg-primary hover:bg-foreground/50 md:hover:bg-background md:hover:brightness-110'
		>
			{msg?.shouldAddLabel && <ChatLabel createdAt={msg.created_at} />}
			{msg.reply_id && (
				<Link
					href={`#${msg.parent_message_id || msg.message_id}`}
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
						<div className='flex size-4 items-center justify-center rounded-full bg-foreground'>
							<svg width='10' height='10' viewBox='0 0 12 8'>
								<path
									d='M0.809739 3.59646L5.12565 0.468433C5.17446 0.431163 5.23323 0.408043 5.2951 0.401763C5.35698 0.395482 5.41943 0.406298 5.4752 0.432954C5.53096 0.45961 5.57776 0.50101 5.61013 0.552343C5.64251 0.603676 5.65914 0.662833 5.6581 0.722939V2.3707C10.3624 2.3707 11.2539 5.52482 11.3991 7.21174C11.4028 7.27916 11.3848 7.34603 11.3474 7.40312C11.3101 7.46021 11.2554 7.50471 11.1908 7.53049C11.1262 7.55626 11.0549 7.56204 10.9868 7.54703C10.9187 7.53201 10.857 7.49695 10.8104 7.44666C8.72224 5.08977 5.6581 5.63359 5.6581 5.63359V7.28135C5.65831 7.34051 5.64141 7.39856 5.60931 7.44894C5.5772 7.49932 5.53117 7.54004 5.4764 7.5665C5.42163 7.59296 5.3603 7.60411 5.29932 7.59869C5.23834 7.59328 5.18014 7.57151 5.13128 7.53585L0.809739 4.40892C0.744492 4.3616 0.691538 4.30026 0.655067 4.22975C0.618596 4.15925 0.599609 4.08151 0.599609 4.00269C0.599609 3.92386 0.618596 3.84612 0.655067 3.77562C0.691538 3.70511 0.744492 3.64377 0.809739 3.59646Z'
									fill='#B5BAC1'
								></path>
							</svg>
						</div>
						<h6 className='text-xs text-gray-2 group-hover:brightness-150 md:text-sm'>
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
				replyType={replyType}
				styles={styles}
				reloadMessage={reloadMessage}
				handleClick={(e) => handleAppendOrRemoveEmoji(e, msg.message_id)}
				message={msg}
				serverStates={serverStates}
				userId={userId}
				socket={socket}
			/>

			{msg.media_image && !msg.parent_message_id && (
				<ImagePreview image={msg.media_image} messages={messages}/>
			)}
			<div className=' mt-1'>
				{(msg?.threads || []).map((thread) => (
					<ThreadMessages
						username={serverStates.selectedServer?.name!}
						key={thread.thread_id}
						threadId={thread.thread_id}
					>
						<div
							onClick={() => {
								const p = getPath(thread.thread_id);
								router.push(`/server/${params.id}/${params.channel_id}?${p}`);
							}}
							className='flex cursor-pointer items-center gap-3 text-gray-2 brightness-125'
						>
							<Image
								src={'/icons/threads.svg'}
								width={15}
								height={15}
								alt={'threads'}
								key={'threads'}
							/>
							<p className='text-sm'>
								<span className='font-medium text-white'>
									{thread.username}
								</span>{' '}
								started a thread :{' '}
								<span className='text-white'>{thread.thread_name}</span>
							</p>
						</div>
					</ThreadMessages>
				))}
			</div>
		</li>
	);
}

export default memo(ChatItem);
