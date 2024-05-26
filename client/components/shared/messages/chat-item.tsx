import Image from 'next/image';
import Link from 'next/link';
import {
	Dispatch,
	SetStateAction,
	memo,
	useCallback,
	useMemo,
	useState,
} from 'react';

import { Message, Thread } from '@/types/messages';
import ThreadMessages from '../../servers/threads/thread-messages';
import EmojiPickerButton from './emoji-picker';
import { foundMessage } from '@/utils/messages';
import useEmoji from '@/hooks/useEmoji';
import MessageMenu from './menu';
import EditMessageForm from './edit-message';
import { formatDate, formatMessageTimestamp } from '@/utils/createdDate';
import { Permission } from '@/types/server';
import { BannedMembers } from '@/types/socket-states';
import { ServerStates } from '@/providers/server';
import CreateThread from '@/components/servers/threads/create-thread';
import { useSocketContext } from '@/providers/socket-io';

type Props = {
	msg: Message;
	permissions: Permission | undefined;
	isCurrentUserBanned: false | BannedMembers | undefined;
	replyType: 'personal' | 'thread' | 'channel' | 'reply';
	messages: Message[];
	serversState: ServerStates;
	setServerStates: Dispatch<SetStateAction<ServerStates>>;
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
		permissions,
		isCurrentUserBanned,
		serversState,
		setServerStates,
	} = props;

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const {
		userId,
		params,
		reloadChannelMessage,
		reloadPersonalMessage,
		reloadThreadMessages,
	} = useSocketContext();
	const { selectedServer, selectedThread } = serversState;

	const reloadMessages = () => {
		switch (replyType) {
			case 'channel':
				reloadChannelMessage(
					params.channelId as string,
					params.serverId as string
				);
				break;

			case 'personal':
				reloadPersonalMessage();
				break;
			case 'thread':
				reloadThreadMessages(selectedThread?.thread_id!);
				break;

			default:
				break;
		}
	};

	const selectThread = (thread: Thread) => {
		setServerStates((prev) => ({
			...prev,
			selectedThread: thread,
		}));
	};

	const isEdited = useCallback(
		() =>
			new Date(msg.update_at).getTime() > new Date(msg.created_at).getTime(),
		[msg]
	);

	const handleAppendOrRemoveEmoji = useEmoji(
		params.serverId as string,
		userId,
		reloadMessages
	);

	const handleSelectedMessage = useCallback(
		(
			msg: Message,
			action: string,
			type: 'personal' | 'thread' | 'channel' | 'reply'
		) => {
			setServerStates((prev) => ({
				...prev,
				selectedMessage: {
					message: msg,
					type,
					action,
				},
			}));
		},
		[setServerStates]
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
					)}

					<>
						{replyType !== 'personal' && (
							<>
								{(serversState.selectedServer?.owner_id === userId ||
									(permissions && permissions.manage_thread)) && (
									<CreateThread message={msg}>
										<Image
											onClick={() =>
												handleSelectedMessage(msg, 'create_thread', 'thread')
											}
											src={'/icons/threads.svg'}
											width={20}
											height={20}
											alt='threads'
										/>
									</CreateThread>
								)}
							</>
						)}
					</>

					<MessageMenu
						permissions={permissions}
						serverAuthor={selectedServer?.owner_id || ''}
						type={replyType}
						handleSelectedMessage={handleSelectedMessage}
						currentUser={userId}
						channelId={params.channelId as string}
						message={msg}
						serverId={params.serverId as string}
					/>
				</div>
			)}
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
						serversState={serversState}
						setServerStates={setServerStates}
						isCurrentUserBanned={isCurrentUserBanned}
						permissions={permissions}
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
