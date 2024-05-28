import { useCallback, useRef } from 'react';

import ChatForm from '@/components/shared/messages/chat-form';
import ChatItem from '@/components/shared/messages/chat-item';
import useScroll from '@/hooks/useScroll';
import { useSocket } from '@/providers/socket-io';
import { useParams } from 'next/navigation';
import { useServerContext } from '@/providers/server';

export default function ChannelMessages() {
	const params = useParams();
	const ref = useRef<HTMLUListElement>(null);

	const { states } = useSocket();
	const { states: serverStates, updateState } = useServerContext();
	const messages = states.channel_messages;

	const reloadChannelMessage = useCallback(() => {
		states.socket?.emit('get-channel-message', {
			channelId: params?.channel_id as string,
			serverId: params?.id as string,
		});
	}, [params?.channel_id, params?.id, states.socket]);



	useScroll(ref, messages);


	return (
		<div className='flex h-[calc(100vh-120px)] max-w-full flex-col'>
			<ul
				className='ease relative flex h-dvh min-h-full flex-col gap-10 overflow-y-auto p-2 transition-all duration-500 md:h-screen md:p-5'
				ref={ref}
			>
				{messages?.map((message) => (
					<ChatItem
						setStates={updateState}
						reloadMessages={reloadChannelMessage}
						selectedChannel={serverStates.selectedChannel}
						selectedMessage={serverStates.selectedMessage}
						selectedServer={serverStates.selectedServer}
						selectedThread={serverStates.selectedThread}
						replyType='channel'
						key={message.created_at}
						messages={messages}
						msg={message}
					/>
				))}
			</ul>

				<ChatForm
					reloadMessage={reloadChannelMessage}
					type='channel'
					placeholder={`Message #${serverStates.selectedChannel?.channel_name}`}
				/>
			
		</div>
	);
}
