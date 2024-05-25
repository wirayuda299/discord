import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { ReactNode, memo, useMemo, useEffect } from 'react';

import { Sheet, SheetContent, SheetTrigger } from '../../ui/sheet';
import ChatForm from '../../shared/messages/chat-form';
import ChatItem from '../../shared/messages/chat-item';

import useSocket from '@/hooks/useSocket';
import { useServerContext } from '@/providers/server';
import { findBannedMembers } from '@/utils/banned_members';
import useFetch from '@/hooks/useFetch';
import { getBannedMembers } from '@/helper/members';

type Props = {
	threadId: string;
	username: string;
	children: ReactNode;
};

function ThreadMessages({ threadId, children }: Props) {
	const { states, reloadThreadMessages, socket, userId,loading, searchParams, params } =
		useSocket();
	const { serversState, setServerStates } = useServerContext();
	const { selectedServer, selectedChannel, selectedMessage, selectedThread } =
		serversState;

	const messages = useMemo(
		() => states.thread_messages,
		[states.thread_messages]
	);

	const {
		data: bannedMembers,
		error: bannedMembersError,
		isLoading: bannedMembersLoading,
	} = useFetch('banned-members', () => getBannedMembers(params.serverId as string));
	const isCurrentUserBanned = findBannedMembers(bannedMembers || [], userId!!);

	useEffect(() => {
		reloadThreadMessages(threadId);
	}, [reloadThreadMessages, threadId]);

	const path = `/server/${selectedServer?.id}/${selectedChannel?.channel_id}?channel_type=${selectedChannel?.channel_type}`;

	if(bannedMembersLoading) return <p>loading....</p>
	if(bannedMembersError) return <p>error....</p>

	return (
		<Sheet
			onOpenChange={(isOpen) => {
				if (!isOpen) {
					setServerStates((prev) => ({
						...prev,
						selectedThread: null,
						selectedMessage: null,
					}));
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
							<span className=' uppercase text-gray-2'>
								{selectedThread?.thread_name}
							</span>
						</h3>
					</header>
					<ul className='flex h-auto w-full flex-col gap-5 overflow-y-auto p-3'>
						{loading ? (
										<div className='flex flex-col gap-5'>
						{[1, 2, 3, 4, 5, 6].map((l) => (
							<div
								className='h-8 w-full animate-pulse bg-background brightness-110'
								key={l}
							></div>
						))}
					</div>
						) : (
							messages?.map((message) => (
								<ChatItem
									serverId={params.serverId as string}
									channelId={params.channelId as string}
									setServerStates={setServerStates}
									replyType='thread'
									reloadMessage={() => reloadThreadMessages(threadId)}
									socket={socket}
									serverStates={serversState}
									messages={states.thread_messages}
									userId={userId!!}
									msg={message}
									key={message.message_id}
								/>
							))
						)}
					</ul>
				</div>
				<div className=' sticky bottom-0 flex w-full flex-col justify-end backdrop-blur-md'>
					{selectedMessage && searchParams.get('type') === 'reply' && (
						<div className='flex w-full items-center justify-between rounded-t-xl bg-[#2b2d31] p-2'>
							<p className='bottom-16 text-sm text-gray-2'>
								Replying to{' '}
								<span className='font-semibold text-gray-2 brightness-150'>
									{selectedMessage.message && selectedMessage.message.username}
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
					{!isCurrentUserBanned && (
						<ChatForm
							socketStates={states}
							reloadMessage={() => reloadThreadMessages(threadId)}
							params={params}
							searchParams={searchParams}
							userId={userId!!}
							placeholder='Send message'
							serverStates={serversState}
							setServerStates={setServerStates}
							socket={socket}
							type='thread'
						/>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}

export default memo(ThreadMessages);
