import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef } from 'react';
import { Virtuoso } from 'react-virtuoso'
import ChatForm from '@/components/shared/messages/chat-form';
import ChatItem from '@/components/shared/messages/chat-item';
import useScroll from '@/hooks/useScroll';
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
	const ref = useRef<HTMLUListElement>(null);

	const { reloadChannelMessage, states, socket, params, userId, searchParams } =
		useSocket();


	const reloadChannelMessages = useCallback(() =>
		reloadChannelMessage(params.channelId as string, params.serverId as string), [params.channelId, params.serverId, reloadChannelMessage]);

	useEffect(() => {
		reloadChannelMessages()
	}, [reloadChannelMessages, socket, states.channel_messages])

	const isCurrentUserBanned = useMemo(
		() => findBannedMembers(states.banned_members, userId!),
		[states.banned_members, userId]
	);


	useScroll(ref, states.channel_messages);

	return (
		<div className='flex h-[calc(100vh-120px)] max-w-full flex-col'>
			<ul
				ref={ref}
				className='ease relative flex min-h-full flex-col gap-10 overflow-y-auto p-2 transition-all duration-500 md:p-5'
			>
				<Virtuoso
					style={{ height: '100%' }}
					data={states.channel_messages}
					totalCount={states.channel_messages.length}
					itemContent={(index, message) => (
						<ChatItem
							channelId={params.channelId as string}
							setServerStates={setServerStates}
							socketStates={states}
							replyType='channel'
							key={message.created_at}
							styles='hidden'
							reloadMessage={reloadChannelMessages}
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
					reloadMessage={() => reloadChannelMessages()}
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
