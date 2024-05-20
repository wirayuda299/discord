'use server';

import { ApiRequest } from '@/utils/api';
import { revalidate } from '@/utils/cache';

const api = new ApiRequest();

export async function kickMember(
	serverId: string,
	memberId: string,
	serverAuthor: string,
	currentUser: string
) {
	try {
		await api.post(`/members/kick`, {
			serverId,
			memberId,
			serverAuthor,
			currentUser,
		});
		revalidate(`/server/${serverId}`);
	} catch (error) {
		throw error;
	}
}

export async function banMember(
	serverId: string,
	memberId: string,
	bannedBy: string
) {
	try {
		await api.post('/members/ban', {
			serverId,
			memberId,
			bannedBy,
		});
		revalidate(`/server/${serverId}`);
	} catch (error) {
		throw error;
	}
}
