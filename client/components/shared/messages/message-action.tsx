import { useCallback } from 'react';
import Image from 'next/image';

import usePermissions from '@/hooks/usePermissions';
import { ServerStates } from '@/providers/server';
import { Message } from '@/types/messages';
import EmojiPickerButton from './emoji-picker';
import useEmoji from '@/hooks/useEmoji';
import CreateThread from '@/components/servers/threads/create-thread';
import MessageMenu from './menu';

type Props = {
	userId: string;
	type: 'personal' | 'thread' | 'channel' | 'reply';
	serverId: string;
	ownerId: string;
	channelId: string;
	setStates: (value: Partial<ServerStates>) => void;
	reloadMessages: () => void;
	msg: Message;
	handleOpen: () => void;
};

export default function MessagesAction({
	userId,
	serverId,
	setStates,
	reloadMessages,
	msg,
	handleOpen,
	channelId,
	ownerId,
	type,
}: Props) {
	const { isCurrentUserBanned, isError, loading, permissions } = usePermissions(
		userId,
		serverId
	);

	const handleSelectedMessage = useCallback(
		(
			msg: Message,
			action: string,
			type: 'personal' | 'thread' | 'channel' | 'reply'
		) => {
			setStates({
				selectedMessage: {
					message: msg,
					type,
					action,
				},
			});
		},
		[setStates]
	);

	const handleAppendOrRemoveEmoji = useEmoji(
		serverId,
		userId!!,
		reloadMessages
	);
	if (isCurrentUserBanned || isError || loading) return null;

	return (
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
					onClick={handleOpen}
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
				{type !== 'personal' && (
					<>
						{(ownerId === userId ||
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
				serverAuthor={ownerId || ''}
				type={type}
				handleSelectedMessage={handleSelectedMessage}
				currentUser={userId!!}
				channelId={channelId}
				message={msg}
				serverId={serverId}
			/>
		</div>
	);
}
