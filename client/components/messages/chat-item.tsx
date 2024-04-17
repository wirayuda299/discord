import Image from 'next/image';
import { Reply } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';
import Link from 'next/link';

import EditMessageForm from './edit-message';
import EmojiPickerButton from './emoji-picker';
import ImagePreview from '../modals/image-preview';
import MessageMenu from './menu';
import { Message } from '@/types/messages';
import { formatMessageTimestamp } from '@/utils/createdDate';
import { addOrRemoveReaction } from '@/actions/reactions';
import { cn } from '@/lib/utils';
import { ServerStates } from '@/providers/server';
import { createError } from '@/utils/error';

export default function ChatItem({
	msg,
	serverId,
	userId,
	channelId,
	setServerStates,
	messages,
	serverStates,
}: {
	msg: Message & { shouldAddLabel?: boolean };
	serverId: string;
	userId: string;
	channelId: string;
	messages: Message[];
	serverStates: ServerStates;
	setServerStates: Dispatch<SetStateAction<ServerStates>>;
}) {
	const [formOpen, setFormOpen] = useState<boolean>(false);

	async function handleClick(e: any) {
		try {
			await addOrRemoveReaction(
				msg.message_id,
				e.emoji,
				e.unified,
				serverId,
				userId
			);
		} catch (error) {
			createError(error);
		}
	}
	const foundMessage = messages.find((message) =>
		message.reply_id
			? message.reply_id === msg.message_id
			: message.message_id === msg.message_id
	);

	return (
		<li
			id={msg.message_id}
			className='md:hover:bg-background hover:bg-foreground/50 target:bg-primary rounded-md p-1 md:hover:brightness-110'
		>
			{msg?.shouldAddLabel && (
				<div className='flex w-full items-center gap-2 pb-5'>
					<div className='bg-gray-1 h-px w-full'></div>
					<p className='text-gray-2 text-nowrap text-sm'>
						{formatMessageTimestamp(msg.msg_created_at)}
					</p>
					<div className='bg-gray-1 h-px w-full'></div>
				</div>
			)}
			{msg.reply_id && (
				<Link
					href={`#${msg.message_id}`}
					className='group flex w-auto items-center pl-5'
				>
					<Image
						className='mt-2 aspect-auto min-w-8 object-contain'
						src='/icons/connected-line.svg'
						width={20}
						height={20}
						alt='line'
					/>

					<div className='flex max-w-[500px] gap-2 '>
						<div className='bg-foreground flex min-h-4 min-w-4 items-center justify-center rounded-full'>
							<svg width='10' height='10' viewBox='0 0 12 8'>
								<path
									d='M0.809739 3.59646L5.12565 0.468433C5.17446 0.431163 5.23323 0.408043 5.2951 0.401763C5.35698 0.395482 5.41943 0.406298 5.4752 0.432954C5.53096 0.45961 5.57776 0.50101 5.61013 0.552343C5.64251 0.603676 5.65914 0.662833 5.6581 0.722939V2.3707C10.3624 2.3707 11.2539 5.52482 11.3991 7.21174C11.4028 7.27916 11.3848 7.34603 11.3474 7.40312C11.3101 7.46021 11.2554 7.50471 11.1908 7.53049C11.1262 7.55626 11.0549 7.56204 10.9868 7.54703C10.9187 7.53201 10.857 7.49695 10.8104 7.44666C8.72224 5.08977 5.6581 5.63359 5.6581 5.63359V7.28135C5.65831 7.34051 5.64141 7.39856 5.60931 7.44894C5.5772 7.49932 5.53117 7.54004 5.4764 7.5665C5.42163 7.59296 5.3603 7.60411 5.29932 7.59869C5.23834 7.59328 5.18014 7.57151 5.13128 7.53585L0.809739 4.40892C0.744492 4.3616 0.691538 4.30026 0.655067 4.22975C0.618596 4.15925 0.599609 4.08151 0.599609 4.00269C0.599609 3.92386 0.618596 3.84612 0.655067 3.77562C0.691538 3.70511 0.744492 3.64377 0.809739 3.59646Z'
									fill='#B5BAC1'
								></path>
							</svg>
						</div>
						<h6 className='text-gray-2 text-sm group-hover:brightness-150'>
							{foundMessage?.author_name}
						</h6>
						<div className='flex gap-2 overflow-hidden'>
							<span className='text-gray-2 truncate text-sm group-hover:brightness-150'>
								{foundMessage?.message}
							</span>
						</div>
					</div>
				</Link>
			)}
			<div className='group !relative  flex justify-between'>
				<div className='flex !items-start gap-x-2 text-white'>
					<p className='inline-flex gap-x-1 text-nowrap pt-[2px] text-xs leading-snug text-gray-600'>
						{new Date(msg.msg_created_at).toLocaleString('en-US', {
							hour: 'numeric',
							hour12: true,
						})}{' '}
					</p>
					<>
						<div
							className={cn(
								'flex items-start flex-wrap gap-2',
								formOpen && 'flex-col'
							)}
						>
							<p className='text-gray-2 text-sm leading-snug'>
								{msg.author_name}
							</p>

							{formOpen ? (
								<EditMessageForm
									currentUser={userId}
									messageAuthor={msg.author_id}
									messageId={msg.message_id}
									serverId={serverId}
									message={msg.message}
									handleClose={() => setFormOpen(false)}
								/>
							) : (
								<p
									className='min-w-min text-wrap  text-sm text-[#d9dee1]'
									style={{
										wordWrap: 'break-word',
										wordBreak: 'break-all',
									}}
								>
									{msg.message}
									{new Date(msg.msg_updated_at) >
										new Date(msg.msg_created_at) && (
										<span className='text-gray-2 text-xs'>(edited)</span>
									)}
								</p>
							)}
						</div>{' '}
						{!formOpen && (
							<div className='inline-flex flex-wrap items-center gap-2 pt-2'>
								{msg.reactions.map((reaction) => (
									<span
										key={reaction.emoji}
										className='border-primary text-md rounded-lg border bg-[#373a54] px-1.5'
									>
										{reaction.emoji}
										{reaction.count}
									</span>
								))}
							</div>
						)}
					</>
				</div>

				<div className='bg-background absolute right-0 h-7 !min-w-20 rounded opacity-0 shadow-lg brightness-110 group-hover:opacity-100'>
					<div className=' flex h-full items-center gap-4 px-2'>
						<EmojiPickerButton handleClick={handleClick} />
						{msg.author_id === userId ? (
							<button
								name='Edit message'
								title='Edit message'
								type='button'
								onClick={() => setFormOpen((prev) => !prev)}
							>
								<Image
									src={'/icons/pencil.svg'}
									width={20}
									height={20}
									alt='pencil'
								/>
							</button>
						) : (
							<button name='Reply message' title='Reply message' type='button'>
								<Reply />
							</button>
						)}
						<button type='button' name='Create Threads' title='Create Threads'>
							<Image
								src={'/icons/threads.svg'}
								width={20}
								height={20}
								alt='threads'
							/>
						</button>
						{msg.author_id === userId && (
							<MessageMenu
								serverStates={serverStates}
								setServerStates={setServerStates}
								currentUser={userId}
								channelId={channelId}
								message={msg}
								serverId={serverId}
							/>
						)}
					</div>
				</div>
			</div>
			{msg.media_image && <ImagePreview image={msg.media_image} />}
		</li>
	);
}
