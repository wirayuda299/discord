'use client';

import { ChevronRight } from 'lucide-react';
import { memo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import {
	Drawer,
	DrawerTitle,
	DrawerTrigger,
	DrawerContent,
} from '../ui/drawer';

import { cn } from '@/lib/utils';
import { useServerContext } from '@/providers/server';

import { useParams } from 'next/navigation';
import useFetch from '@/hooks/useFetch';
import { getServerMembers } from '@/helper/server';
import MemberItem from '../members/memberItem';
import useSocket from '@/hooks/useSocket';
import { Message } from '@/types/messages';
import ImagePreview from '../modals/image-preview';
import { getPinnedMessages } from '@/helper/message';

const options = ['members', 'media', 'pins'] as const;

function filterMedia(messages: Message[]) {
	return messages
		.map((message: Message) => message.media_image)
		.filter((media: string) => Boolean(media));
}

 function ChannelInfo() {
	const [selectedOption, setSelectedOption] = useState<string>('members');
	const {
		serversState: { selectedChannel },
	} = useServerContext();
	const { states } = useSocket();
	const params = useParams();
	const media = filterMedia(states.channel_messages);

	const { data, error, isLoading } = useFetch('members', () =>
		getServerMembers((params?.id as string) || '')
	);

	const { data: pinnedMessages, isLoading: pinnedMessagesLoading } = useFetch(
		'pinned-messages',
		() => getPinnedMessages(params?.channel_id as string)
	);

	if (!selectedChannel) return null;

	return (
		<Drawer>
			<DrawerTrigger asChild>
				<button type='button'>
					<ChevronRight className='mt-2 text-gray-2' size={17} />
				</button>
			</DrawerTrigger>
			<DrawerContent className='border-t-2 border-background bg-black p-3 text-white'>
				<DrawerTitle className='py-5 text-center '>
					#{selectedChannel.channel_name}
				</DrawerTitle>
				<ul className='flex items-center justify-evenly py-4'>
					{options.map((option) => (
						<li
							onClick={() => setSelectedOption(option)}
							className={cn(
								'transition-all  duration-300 text-sm font-semibold capitalize',
								selectedOption === option &&
									'text-primary border-b-2 border-b-primary'
							)}
							key={option}
						>
							{option}
						</li>
					))}
				</ul>

				{selectedOption === 'members' && (
					<div className='pt-5'>
						<h3 className='mb-3 text-base font-semibold text-gray-2'>
							Members
						</h3>
						{error && <p>{error.message}</p>}
						{isLoading ? (
							<div className='space-y-4'>
								{[1, 2, 3, 4].map((c) => (
									<div
										key={c}
										className='h-8 w-full animate-pulse rounded-md bg-background brightness-110'
									></div>
								))}
							</div>
						) : (
							data?.map((member) => (
								<MemberItem
									member={member}
									activeUsers={states.active_users}
									key={member.id}
								/>
							))
						)}
					</div>
				)}
				{selectedOption === 'media' && (
					<div className='flex w-full flex-wrap justify-center gap-3'>
						{media.length < 1 && <p className='text-center'>No media yet</p>}
						{media?.map((m: string) => (
							<ImagePreview
								styles='ml-0'
								image={m}
								messages={states.channel_messages}
								key={m}
							/>
						))}
					</div>
				)}

				{selectedOption === 'pins' && (
					<>
						{(pinnedMessages && pinnedMessages?.length < 1) ||
						pinnedMessagesLoading ? (
							<div className='flex min-h-60 w-full flex-col items-center justify-center'>
								<Image
									src={'/icons/boom.svg'}
									width={100}
									height={100}
									alt={'boom'}
									key={'boom'}
								/>
								<p className='max-w-[calc(100%-50px)] pt-2 text-center text-sm text-white'>
									This channel doesn&apos;t have any pinned messages...yet.
								</p>
							</div>
						) : (
							<div className='size-full  space-y-3 overflow-y-auto'>
								{pinnedMessages?.map((msg) => (
									<div
										key={msg.message_id}
										className='group relative flex w-full gap-2 rounded-md p-3 text-gray-2 hover:bg-foreground hover:brightness-105'
									>
										<Image
											className='aspect-auto size-10 rounded-full object-cover'
											src={msg.image}
											width={30}
											height={30}
											alt='author'
										/>
										<div>
											<h4 className='text-sm font-semibold'>{msg.username}</h4>
											<p className=' break-before-auto whitespace-pre-wrap break-all text-sm font-light'>
												{msg.content}
											</p>
										</div>
										<Link
											href={`#${msg.message_id}`}
											className='absolute right-2 top-2	 hidden rounded-md bg-background px-3 py-1 text-xs brightness-125 group-hover:block'
										>
											jump
										</Link>
									</div>
								))}
							</div>
						)}
						<footer className='mt-3 min-h-16 bg-foreground p-2 text-white'>
							<h4 className='text-center text-base font-semibold uppercase text-green-600'>
								ProTip:
							</h4>
							<p className='pt-2  text-center text-sm text-gray-2'>
								User with &apos;Manage messages&apos; can pin a message <br />{' '}
								from it&apos;s context menu.
							</p>
						</footer>
					</>
				)}
			</DrawerContent>
		</Drawer>
	);
 }
export default memo(ChannelInfo);
