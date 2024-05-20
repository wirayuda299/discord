import { Conversation } from '@/types/messages';
import { prepareHeaders } from './cookies';

const SERVER_URL = process.env.SERVER_URL;

export async function getConversationList(
	userId: string
): Promise<Conversation[]> {
	try {
		const res = await fetch(
			`${SERVER_URL}/conversations/list?userId=${userId}`,
			{
				method: 'GET',
				credentials: 'include',
				headers: await prepareHeaders(),
				cache: 'no-store',
			}
		);

		const conversations = await res.json();
		return conversations.data;
	} catch (error) {
		throw error;
	}
}
