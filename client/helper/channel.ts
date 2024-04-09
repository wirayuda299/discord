import { getCookies } from './cookies';
const serverUrl = process.env.SERVER_URL;

const prepareHeaders = async () => {
	return {
		'content-type': 'application/json',
		Cookie: await getCookies(),
	};
};
type ReturnTypes = {
	channel: {
		id: string;
		created_at: string;
		updated_at: string;
		server_id: string;
		name: string;
	};
	messages: any[];
};

export async function getChannelById(
	id: string,
	cookies: string
): Promise<ReturnTypes> {
	try {
		const res = await fetch(`${serverUrl}/channels/${id}`, {
			method: 'GET',
			credentials: 'include',
			headers: await prepareHeaders(),
		});
		const channel = await res.json();
		return channel.data;
	} catch (error) {
		throw error;
	}
}
