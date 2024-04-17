'use server';

import { ApiRequest } from '@/utils/api';

const api = new ApiRequest();

export async function createThread(
	messageId: string,
	userId: string,
	name: string
) {
	try {
		return await api.post('/threads/create', {
			msgId: messageId,
			userId,
			name: name ?? '',
		});
	} catch (error) {
		throw error;
	}
}
