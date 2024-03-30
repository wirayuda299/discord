'use server';

import { ApiRequest } from '../utils/api';
import { revalidatePath } from 'next/cache';

const api = new ApiRequest();
export async function getChannelById(id: string) {
	try {
		const channel = await api.get<{
			channel: {
				id: string;
				created_at: string;
				updated_at: string;
				server_id: string;
				name: string;
			};
			messages: any[];
		}>(`/api/v1/channels/${id}`);
		return channel!;
	} catch (error) {
		throw error;
	}
}

export async function createChannel(
	name: string,
	serverId: string,
	type: string,
	path: string
) {
	try {
		await api.post('/api/v1/channels/create', {
			name,
			server_id: serverId,
			type,
		});
		revalidatePath(path);
	} catch (error) {
		throw error;
	}
}
