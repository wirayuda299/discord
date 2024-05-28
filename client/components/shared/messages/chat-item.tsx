import Image from 'next/image';
import Link from 'next/link';
import { memo, useCallback, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

import { Message, Thread } from '@/types/messages';
import ThreadMessages from '../../servers/threads/thread-messages';
import { foundMessage } from '@/utils/messages';
import EditMessageForm from './edit-message';
import { formatDate, formatMessageTimestamp } from '@/utils/createdDate';
import { Servers } from '@/types/server';
import { ServerStates } from '@/providers/server';
import { Channel } from '@/types/channels';
import MessagesAction from './message-action';

type Props = {
	msg: Message;
	replyType: 'personal' | 'thread' | 'channel' | 'reply';
	messages: Message[];
	selectedThread: Thread | null;
	selectedServer: Servers | null;
	selectedMessage: {
		type: 'personal' | 'thread' | 'channel' | 'reply';
		message: Message;
		action: string;
	} | null;
	selectedChannel: Channel | null;
	setStates: (value: Partial<ServerStates>) => void;
	reloadMessages: () => void;
};

const highlightLinks = (text: string) => {
	const urlRegex = /(https?:\/\/[^\s]+)/g;
	const segments = text.split(urlRegex);
	return segments.map((segment, index) => {
		if (segment.match(urlRegex)) {
			return (
				<a
					key={index}
					href={segment}
					target='_blank'
					className='text-blue-600 hover:border-b hover:border-blue-500'
				>
					{segment}
				</a>
			);
		} else {
			return segment;
		}
	});
};

const ChatItem = (props: Props) => {
	const {
		msg,
		messages,
		replyType,
		selectedThread,
		reloadMessages,
		selectedServer,
		selectedMessage,
		selectedChannel,
		setStates,
	} = props;

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const params = useParams();
	const { userId } = useAuth();

	const selectThread = (thread: Thread) => {
		setStates({
			selectedThread: thread,
		});
	};

	const isEdited = useCallback(
		() =>
			new Date(msg.update_at).getTime() > new Date(msg.created_at).getTime(),
		[msg]
	);

	const repliedMessage = useMemo(
		() => foundMessage(messages, msg),
		[messages, msg]
	);

	return (
		<li className='group !relative w-full rounded p-2 text-gray-2 hover:bg-background hover:brightness-110'>
			{msg?.shouldAddLabel && (
				<div className='flex w-full items-center gap-2 pb-5'>
					<div className='h-px w-full bg-gray-1'></div>
					<p className='min-w-min text-nowrap text-sm '>
						{formatMessageTimestamp(msg.created_at)}
					</p>
					<div className='h-px w-full bg-gray-1'></div>
				</div>
			)}
			{msg.parent_message_id && (
				<Link
					href={`#${msg.parent_message_id || msg.message_id}`}
					className='flex items-center gap-2'
				>
					<Image
						className='mt-2 aspect-auto min-w-8 object-contain'
						src='/icons/connected-line.svg'
						width={20}
						height={20}
						alt='line'
					/>

					<div className='flex w-full items-center gap-2 overflow-hidden md:max-w-[200px] lg:max-w-[500px] '>
						<div className='flex size-4 items-center justify-center rounded-full bg-foreground'>
							<Image
								className=' size-3 object-contain'
								src='/icons/reply-small.svg'
								width={20}
								height={20}
								alt='line'
							/>
						</div>
						<h6 className='text-xs text-gray-2 group-hover:brightness-150 md:text-sm'>
							{repliedMessage?.username}
						</h6>
						<p className='text-xs text-gray-2'>{repliedMessage?.message}</p>
					</div>
				</Link>
			)}

			{isOpen ? (
				<EditMessageForm
					reloadMessage={reloadMessages}
					currentUser={userId!}
					messageAuthor={msg.author}
					messageId={msg.message_id}
					message={msg.message}
					handleClose={() => setIsOpen(false)}
				/>
			) : (
				<div className='flex flex-wrap items-center gap-2'>
					<div className='flex items-center gap-2'>
						<div className='flex items-center gap-3'>
							<span className='text-nowrap text-xs'>
								{formatDate(msg.created_at)}
							</span>
							<h5
								className='text-sm font-semibold group-hover:text-white'
								style={{ ...(msg.role && { color: msg.role.role_color }) }}
							>
								{msg.username}
							</h5>
						</div>
						<div className='flex items-center gap-2'>
							{msg.role && msg.role.icon && (
								<Image
									src={msg.role.icon}
									width={20}
									height={20}
									alt='role icon'
									className='size-5 min-w-5 rounded-full object-cover'
								/>
							)}
						</div>
					</div>
					<p className='text-wrap break-all text-sm group-hover:text-white'>
						{highlightLinks(msg.message)}{' '}
						{isEdited() && <span className='text-xs '>(edited)</span>}
					</p>
				</div>
			)}
			<MessagesAction
				channelId={params.channel_id as string}
				handleOpen={() => setIsOpen((prev) => !prev)}
				msg={msg}
				ownerId={selectedServer?.owner_id!}
				reloadMessages={reloadMessages}
				serverId={params.id as string}
				setStates={setStates}
				type={replyType}
				userId={userId!!}
			/>

			{msg.media_image && !msg.parent_message_id && (
				<Image
					src={msg.media_image}
					width={200}
					height={100}
					alt='media'
					priority
					className='ml-9 mt-3 aspect-auto rounded-md object-cover'
				/>
			)}

			<div className='flex flex-wrap items-center gap-3 pt-2'>
				{msg.reactions.map((reaction) => (
					<div
						key={reaction.unified_emoji}
						className='max-w-16 rounded border border-blue-500/55 bg-blue-400/10 px-2 '
					>
						{reaction.emoji}{' '}
						<span className='text-sm font-semibold text-white'>
							{reaction.count}
						</span>
					</div>
				))}
			</div>

			<div className=' pt-2'>
				{(msg?.threads || []).map((thread) => (
					<ThreadMessages
						selectedChannel={selectedChannel}
						selectedMessage={selectedMessage}
						selectedServer={selectedServer}
						selectedThread={selectedThread}
						setStates={setStates}
						thread={thread}
						key={thread.thread_id}
					>
						<div
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
								<span className='font-medium text-white'>
									{thread.username}
								</span>{' '}
								started a thread:{' '}
								<span className='text-white'>{thread.thread_name}</span>
							</p>
						</div>
					</ThreadMessages>
				))}
			</div>
		</li>
	);
};

export default memo(ChatItem);
