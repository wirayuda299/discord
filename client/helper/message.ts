import { Message } from '@/types/messages';
import { getCookies } from './cookies';

const prepareHeaders = async () => {
	return {
		'content-type': 'application/json',
		Cookie: await getCookies(),
	};
};

export async function getPinnedMessages(channelId: string): Promise<Message[]> {
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
