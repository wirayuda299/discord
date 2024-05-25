'use client';

import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import {
	Drawer,
	DrawerTitle,
	DrawerTrigger,
	DrawerContent,
} from '@/components/ui/drawer';

import { cn } from '@/lib/utils/mergeStyle';
import { useServerContext } from '@/providers/server';

import useFetch from '@/hooks/useFetch';
import { getServerMembers } from '@/helper/server';
import MemberItem from '../members/memberItem';
import useSocket from '@/hooks/useSocket';
import { PinnedMessage, getPinnedMessages } from '@/helper/message';
import { Member } from '@/types/server';
import { SocketStates } from '@/types/socket-states';
import { Socket } from 'socket.io-client';

const options = ['members', 'media', 'pins'] as const;

function renderSelectedOption(
	selectedOption: string,
	membersData: Member[],
	membersError: Error,
	membersLoading: boolean,
	media: string[],
	pinnedMessagesData: PinnedMessage[],
	pinnedMessagesLoading: boolean,
	currentUser: string,
	ownerId: string,
	states: SocketStates,
	socket: Socket | null
) {
	switch (selectedOption) {
		case 'members':
			return renderMembers(
				membersData,
				membersError,
				membersLoading,
				currentUser,
				ownerId,
				states,
				socket
			);
		case 'media':
			return renderMedia(media);
		case 'pins':
			return renderPins(pinnedMessagesData, pinnedMessagesLoading);
		default:
			return null;
	}
}

function renderMembers(
	membersData: Member[],
	membersError: Error,
	membersLoading: boolean,
	currentUser: string,
	ownerId: string,
	states: SocketStates,
	socket: Socket | null
) {
	return (
		<div className='pt-5'>
			<h3 className='mb-3 text-base font-semibold text-gray-2'>Members</h3>
			{membersError && <p>{membersError.message}</p>}
			{membersLoading ? (
				<div className='space-y-4'>
					{[1, 2, 3, 4].map((c) => (
						<div
							key={c}
							className='h-8 w-full animate-pulse rounded-md bg-background brightness-110'
						></div>
					))}
				</div>
			) : (
				membersData?.map((member) => (
					<MemberItem
						serverId={member.server_id}
						currentUser={currentUser}
						ownerId={ownerId}
						socket={socket}
						states={states}
						member={member}
						key={member.id}
					/>
				))
			)}
		</div>
	);
}

function renderMedia(media: string[]) {
	return (
		<div className='flex w-full flex-wrap justify-center gap-3'>
			{media.length < 1 && <p className='text-center'>No media yet</p>}
			{media?.map((m: string) => (
				<Image
					key={m}
					src={m}
					width={200}
					height={100}
					placeholder='blur'
					alt='media'
					className='ml-0 mt-3 aspect-auto rounded-md object-cover'
					loading='lazy'
				/>
			))}
		</div>
	);
}

function renderPins(
	pinnedMessagesData: PinnedMessage[],
	pinnedMessagesLoading: boolean
) {
	return (
		<>
			{(pinnedMessagesData && pinnedMessagesData?.length < 1) ||
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
					{pinnedMessagesData?.map((msg) => (
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
					User with &apos;Manage messages&apos; can pin a message <br /> from
					it&apos;s context menu.
				</p>
			</footer>
		</>
	);
}

export default function ChannelInfo() {
	const [selectedOption, setSelectedOption] = useState('members');
	const {
		serversState: { selectedChannel, selectedServer },
	} = useServerContext();
	const { states, params, userId, socket } = useSocket();

	const {
		data: membersData,
		error: membersError,
		isLoading: membersLoading,
	} = useFetch('members', () =>
		getServerMembers((params?.serverId as string) || '')
	);

	const { data: pinnedMessagesData, isLoading: pinnedMessagesLoading } =
		useFetch('pinned-messages', () =>
			getPinnedMessages(params?.channelId as string)
		);

	const media = (states?.channel_messages ||[])
		.filter((message) => message.media_image)
		.map((message) => message.media_image);

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
								'cursor-pointer transition-all duration-300 text-sm font-semibold capitalize',
								selectedOption === option &&
									'text-primary border-b-2 border-b-primary'
							)}
							key={option}
						>
							{option}
						</li>
					))}
				</ul>
				{renderSelectedOption(
					selectedOption,
					membersData || [],
					membersError,
					membersLoading,
					media,
					pinnedMessagesData || [],
					pinnedMessagesLoading,
					userId!!,
					selectedServer?.owner_id!!,
					states,
					socket
				)}
			</DrawerContent>
		</Drawer>
	);
}
