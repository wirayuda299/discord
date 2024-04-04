'use server';

import { Message } from '@/types/messages';
import { ApiRequest } from '@/utils/api';
import { revalidatePath } from 'next/cache';

const api = new ApiRequest();

export async function pinMessage(
	channelId: string,
	msgId: string,
	path: string
) {
	try {
		await api.post('/messages/pin-message', {
			channelId,
			messageId: msgId,
		});
		revalidatePath(path);
	} catch (error) {
		throw error;
	}
}
export async function getPinnedMessages(channelId: string) {
	try {
		return await api.get<Message[]>(
			`/messages/pinned-messages?channelId=${channelId}`
		);
	} catch (error) {
		throw error;
	}
}
