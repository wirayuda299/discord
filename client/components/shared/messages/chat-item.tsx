import Image from 'next/image';
import Link from 'next/link';
import { memo, useCallback, useMemo, useState } from 'react';

import { Message, Thread } from '@/types/messages';
import { useServerContext } from '@/providers/server';
import ThreadMessages from '../../servers/threads/thread-messages';
import EmojiPickerButton from './emoji-picker';
import { foundMessage } from '@/utils/messages';
import useEmoji from '@/hooks/useEmoji';
import MessageMenu from './menu';
import EditMessageForm from './edit-message';
import { formatDate, formatMessageTimestamp } from '@/utils/createdDate';
import { useSocketContext } from '@/providers/socket-io';
import { Permission } from '@/types/server';
import { BannedMembers } from '@/types/socket-states';

type Props = {
	msg: Message;
	permissions: Permission | undefined;
	isCurrentUserBanned: false | BannedMembers | undefined;
	userId: string;
	serverId: string;
	channelId: string;
	replyType: 'personal' | 'thread' | 'channel' | 'reply';
	messages: Message[];
	reloadMessage: () => void;
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
		userId,
		reloadMessage,
		serverId,
		replyType,
		channelId,
		permissions,
		isCurrentUserBanned,
	} = props;
	const [isOpen, setIsOpen] = useState<boolean>(false);
	
	const { serversState, setServerStates } = useServerContext();
	const { selectedServer } = serversState;
	const { socket } = useSocketContext();

	const isEdited = () =>
		new Date(msg.update_at).getTime() > new Date(msg.created_at).getTime();

	const handleAppendOrRemoveEmoji = useEmoji(
		selectedServer?.id || '',
		userId,
		reloadMessage
	);

	const handleSelectedMessage = useCallback((msg: Message) => {
		setServerStates((prev) => ({
			...prev,
			selectedMessage: {
				message: msg,
				type: replyType,
				action: 'reply',
			},
		}));
	}, []);

	const repliedMessage = useMemo(() => foundMessage(messages, msg), []);

	const selectThread = useCallback((thread: Thread) => {
		setServerStates((prev) => ({
			...prev,
			selectedThread: thread,
		}));
	}, []);

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

			{!isOpen && (
				<div className='flex flex-wrap items-center gap-2'>
					<div className='flex items-center gap-2'>
						<div className='flex gap-3'>
							<span className='text-nowrap text-xs'>
								{formatDate(msg.created_at)}
							</span>
							<h5
								className='text-sm font-semibold group-hover:text-white'
								style={{
									...(msg.role && { color: msg.role.role_color }),
								}}
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
					<p className='text-wrap break-all  text-sm group-hover:text-white'>
						{highlightLinks(msg.message)}{' '}
						{isEdited() && <span className='text-xs '>(edited)</span>}
					</p>
				</div>
			)}
			{isOpen && (
				<EditMessageForm
					reloadMessage={reloadMessage}
					currentUser={userId!}
					messageAuthor={msg.author}
					messageId={msg.message_id}
					message={msg.message}
					handleClose={() => setIsOpen(false)}
				/>
			)}

			{!isCurrentUserBanned && (
				<div className='absolute right-0 top-0 flex gap-3 bg-background p-1 opacity-0 shadow-xl group-hover:opacity-100'>
					<EmojiPickerButton
						handleClick={(e) => handleAppendOrRemoveEmoji(e, msg.message_id)}
					/>
					{msg.author === userId && (
						<button
							name='Edit message'
							title='Edit message'
							type='button'
							className='min-w-5'
							onClick={() => setIsOpen((prev) => !prev)}
						>
							<Image
								src={'/icons/pencil.svg'}
								width={20}
								height={20}
								alt='pencil'
							/>
						</button>
					)}{' '}
					<MessageMenu
						permissions={permissions}
						serverAuthor={selectedServer?.owner_id || ''}
						type={replyType}
						socket={socket}
						handleSelectedMessage={handleSelectedMessage}
						currentUser={userId}
						channelId={channelId}
						message={msg}
						serverId={serverId!}
					/>
				</div>
			)}
			{msg.media_image && !msg.parent_message_id && (
				<Image
					src={msg.media_image}
					width={200}
					height={100}
					alt='media'
					className='ml-9 mt-3 aspect-auto rounded-md object-cover'
					loading='lazy'
				/>
			)}

			<div className='mt-2'>
				{(msg?.threads || []).map((thread) => (
					<ThreadMessages
						thread={thread}
						selectThread={selectThread}
						key={thread.thread_id}
					/>
				))}
			</div>
		</li>
	);
};

export default memo(ChatItem);
