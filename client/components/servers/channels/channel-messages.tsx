import { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';

import ChatForm from '@/components/shared/messages/chat-form';
import ChatItem from '@/components/shared/messages/chat-item';
import useSocket from '@/hooks/useSocket';
import { findBannedMembers } from '@/utils/banned_members';
import { ServerStates } from '@/providers/server';

export default function ChannelMessages({
	serversState,
	setServerStates,
}: {
	serversState: ServerStates;
	setServerStates: Dispatch<SetStateAction<ServerStates>>;
}) {

	const { states, socket, reloadChannelMessage, params, userId, searchParams } =
		useSocket();
	const messages = useMemo(
		() => states.channel_messages,
		[states.channel_messages]
	);

	useEffect(() => {
		reloadChannelMessage(params.channelId as string, params.serverId as string);
	}, [params.channelId, params.serverId, reloadChannelMessage, socket]);

	const isCurrentUserBanned = useMemo(
		() => findBannedMembers(states.banned_members, userId!),
		[states.banned_members, userId]
	);


	return (
		<div className='flex h-[calc(100vh-120px)] max-w-full flex-col'>
			<ul
				className='ease relative flex h-dvh min-h-full flex-col gap-10 overflow-y-auto p-2 transition-all duration-500 md:h-screen md:p-5'
			>
				<Virtuoso
					style={{ height: '100%' }}
					data={messages}
					itemContent={(index, message) => (
						<ChatItem
							channelId={params.channelId as string}
							setServerStates={setServerStates}
							socketStates={states}
							replyType='channel'
							key={message.created_at}
							styles='hidden'
							reloadMessage={() =>
								reloadChannelMessage(
									params.channelId as string,
									params.serverId as string
								)
							}
							messages={states.personal_messages}
							msg={message}
							socket={socket}
							userId={userId || ''}
							serverStates={serversState}
						/>
					)}
				/>
			</ul>

			{!isCurrentUserBanned ? (
				<ChatForm
					socketStates={states}
					socket={socket}
					type='channel'
					params={params}
					searchParams={searchParams}
					userId={userId!!}
					reloadMessage={() =>
						reloadChannelMessage(
							params.channelId as string,
							params.serverId as string
						)
					}
					setServerStates={setServerStates}
					serverStates={serversState}
					placeholder={`Message #${serversState.selectedChannel?.channel_name}`}
				/>
			) : (
				<p className='text-center text-red-600'>You are banned </p>
			)}
		</div>
	);
}
