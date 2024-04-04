'use server';

import { Channel } from '@/types/channels';
import { revalidatePath } from 'next/cache';
import { Member, Servers } from '../types/server';
import { ApiRequest } from '../utils/api';

const api = new ApiRequest();

export async function createServer(
	name: string,
	logo: string,
	logoAssetId: string
) {
	try {
		const userId = api.getUserId;
		await api.post('/servers/create', {
			name,
			logo,
			ownerId: userId,
			logoAssetId,
		});
		revalidatePath('/');
	} catch (error) {
		throw error;
	}
}

export async function getAllServerCreatedByCurrentUser() {
	try {
		const userId = api.getUserId;
		return await api.get<Servers[]>(`/servers/all-servers?userId=${userId}`);
	} catch (error) {
		throw error;
	}
}

export async function getServerById(id: string) {
	try {
		const res = await api.get<{
			server: Servers[];
			channels: Channel[];
		}>(`/servers/${id}`);

		return res!;
	} catch (error) {
		throw error;
	}
}

export async function generateNewInviteCode(serverId: string, path: string) {
	try {
		await api.patch('/servers/new-invite-code', { serverId });
		revalidatePath(path);
	} catch (error) {
		throw error;
	}
}

export async function inviteUser(
	serverId: string,
	inviteCode: string,
	path: string,
	channelId: string
) {
	try {
		await api.post('/servers/invite-user', {
			inviteCode,
			userId: api.getUserId,
			server_id: serverId,
			channelId,
		});
		revalidatePath(path);
	} catch (error) {
		throw error;
	}
}

export async function getServerMembers(serverId: string) {
	try {
		return await api.get<Member[]>(`/servers/members?serverId=${serverId}`);
	} catch (error) {
		throw error;
	}
}
