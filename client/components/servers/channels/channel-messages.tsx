import { Dispatch, SetStateAction, useMemo, useRef } from 'react';

import ChatForm from '@/components/shared/messages/chat-form';
import ChatItem from '@/components/shared/messages/chat-item';
import useScroll from '@/hooks/useScroll';
import useSocket from '@/hooks/useSocket';
import { ServerStates } from '@/providers/server';
import { findBannedMembers } from '@/utils/banned_members';
import GeneralLoader from '@/components/shared/loader/general';

export default function ChannelMessages({
	serverStates,
	setServerStates,
}: {
	serverStates: ServerStates;
	setServerStates: Dispatch<SetStateAction<ServerStates>>;
}) {
	const ref = useRef<HTMLUListElement>(null);
	const {
		reloadChannelMessage,
		states,
		socket,
		params,
		userId,
		searchParams,
		loading,
	} = useSocket();

	const isCurrentUserBanned = useMemo(
		() => findBannedMembers(states.banned_members, userId!),
		[states.banned_members, userId]
	);

	useScroll(ref, states.channel_messages);

	return (
		<div className='flex h-[calc(100vh-120px)] max-w-full flex-col'>
			<ul
				className='ease flex min-h-full flex-col gap-5 overflow-y-auto p-2 transition-all duration-500 md:p-5'
				ref={ref}
			>
				{loading ? (
					<GeneralLoader/>
				) : (
					states.channel_messages?.map((msg) => (
						<ChatItem
							channelId={(params?.channelId as string) || ''}
							setServerStates={setServerStates}
							socketStates={states}
							replyType='channel'
							reloadMessage={() =>
								reloadChannelMessage(
									params.channelId as string,
									params.serverId as string
								)
							}
							socket={socket}
							serverStates={serverStates}
							messages={states.channel_messages}
							userId={userId!!}
							msg={msg}
							key={msg.message_id}
						/>
					))
				)}
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
					serverStates={serverStates}
					placeholder={`Message #${serverStates.selectedChannel?.channel_name}`}
				/>
			) : (
				<p className='text-center text-red-600'>You are banned </p>
			)}
		</div>
	);
}
