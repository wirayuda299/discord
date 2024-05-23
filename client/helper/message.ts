import { prepareHeaders } from './cookies';

export interface PinnedMessage {
	message_id: string;
	channel_id: string;
	id: string;
	content: string;
	is_read: boolean;
	user_id: string;
	image_url: string;
	image_asset_id: string;
	created_at: string;
	updated_at: string;
	username: string;
	email: string;
	bio: string;
	image: string;
}

type Props = {
	content: string;
	userId: string;
	imageAssetId: string;
	recipientId?: string;
	imageUrl: string;
	conversationId?: string;
	type: string;
	channelId?: string;
	avatar?: string;
	serverId?: string;
	username?: string;
	messageId?: string;
	parentMessageId?: string;
	threadId?: string;
};

export const messageData = ({
	content,
	conversationId = '',
	imageAssetId,
	imageUrl,
	recipientId= '',
	userId,
	type,
	avatar = '',
	channelId = '',
	messageId = '',
	parentMessageId = '',
	serverId = '',
	username = '',
	threadId = '',
}: Props) => ({
	content: content.trim(),
	is_read: false,
	user_id: userId,
	type,
	imageAssetId,
	imageUrl,
	conversationId,
	recipientId,
	avatar,
	channelId,
	messageId,
	serverId,
	parentMessageId,
	username,
	threadId,
});

export async function getPinnedMessages(
	channelId: string
): Promise<PinnedMessage[]> {
	try {
		const res = await fetch(
			`${process.env.SERVER_URL}/messages/pinned-messages?channelId=${channelId}`,
			{
				method: 'GET',
				credentials: 'include',
				headers: await prepareHeaders(),
			}
		);
		const msg = await res.json();
		return msg.data;
	} catch (error) {
		throw error;
	}
}

export async function getMessageInChannel(channelId: string, serverId: string) {
	try {
		const res = await fetch(
			`${process.env.SERVER_URL}/messages/message-channel?channel_id=${channelId}&server_id=${serverId}`,
			{
				method: 'GET',
				credentials: 'include',
				headers: await prepareHeaders(),
			}
		);
		const messages = await res.json();

		return messages.data;
	} catch (error) {
		throw error;
	}
}

export async function editMessage(
	messageAuthor: string,
	currentUser: string,
	messageId: string,
	content: string,
) {
	try {
		await fetch(`${process.env.SERVER_URL}/messages/edit-message`, {
			method: 'PATCH',
			credentials: 'include',
			headers: await prepareHeaders(),
			body: JSON.stringify({
				messageAuthor,
				currentUser,
				messageId,
				content,
			}),
		});
	} catch (error) {
		console.log(error);

		throw error;
	}
}
