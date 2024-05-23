import { revalidatePath } from 'next/cache';

import { Channel } from '@/types/channels';
import { Member, MemberWithRole, ServerProfile, Servers } from '@/types/server';
import { prepareHeaders } from './cookies';
import { revalidate } from '@/utils/cache';

const serverUrl = process.env.SERVER_URL;

export async function getAllServerCreatedByCurrentUser(
	userId: string
): Promise<Servers[]> {
	try {
		const res = await fetch(
			`${serverUrl}/servers/all-servers?userId=${userId}`,
			{
				headers: await prepareHeaders(),
				method: 'GET',
				credentials: 'include',
				cache: 'no-store',
				next: {
					tags: ['servers'],
				},
			}
		);

		const servers = await res.json();
		if (servers.error) {
			throw new Error(servers.messages);
		}

		return servers.data;
	} catch (error) {
		throw error;
	}
}

export async function getServerById(
	id: string
): Promise<{ server: Servers[]; channels: Channel[] }> {
	try {
		if (!id) return { channels: [], server: [] };

		const res = await fetch(`${serverUrl}/servers/${id}`, {
			headers: await prepareHeaders(),
			method: 'GET',
			credentials: 'include',
		});
		const server = await res.json();

		return server.data;
	} catch (error) {
		throw error;
	}
}

export async function generateNewInviteCode(serverId: string, path: string) {
	try {
		await fetch(`${serverUrl}/servers/new-invite-code`, {
			method: 'PATCH',
			headers: await prepareHeaders(),
			credentials: 'include',
			body: JSON.stringify({
				serverId,
			}),
		});
		revalidatePath(path);
	} catch (error) {
		throw error;
	}
}

export async function getServerMembers(serverId: string): Promise<Member[]> {
	try {
		const res = await fetch(`${serverUrl}/members?serverId=${serverId}`, {
			headers: await prepareHeaders(),
			method: 'GET',
			credentials: 'include',
			next: { tags: ['members'] },
		});

		const members = await res.json();
		return members.data;
	} catch (error) {
		throw error;
	}
}

export async function getMembersByRole(
	serverId: string,
	roleName: string
): Promise<MemberWithRole[]> {
	try {
		if (!serverId || !roleName) return [];

		const res = await fetch(
			`${serverUrl}/members/by-role?roleName=${roleName}&serverId=${serverId}`,
			{
				method: 'GET',
				headers: await prepareHeaders(),
				credentials: 'include',
			}
		);

		const members = await res.json();
		return members.data;
	} catch (error) {
		throw error;
	}
}

export async function getMemberWithoutRole(
	serverId: string
): Promise<MemberWithRole[]> {
	try {
		const res = await fetch(
			`${serverUrl}/members/without-role?serverId=${serverId}`,
			{
				method: 'GET',
				headers: await prepareHeaders(),
				credentials: 'include',
			}
		);
		const members = await res.json();
		return members.data;
	} catch (error) {
		throw error;
	}
}

export async function updateServer(
	serverId: string,
	name: string,
	logo: string,
	logoAssetId: string,
	banner: string,
	bannerAssetId: string,
	currentSessionId: string,
	showBanner: boolean,
	showProgressBar: boolean
) {
	try {
		await fetch(`${serverUrl}/servers/update`, {
			method: 'PATCH',
			credentials: 'include',
			headers: await prepareHeaders(),
			body: JSON.stringify({
				serverId,
				currentSessionId,
				name,
				logo,
				logoAssetId,
				showBanner,
				showProgressBar,
				banner,
				bannerAssetId,
			}),
		});
		revalidate('/server');
		revalidate('/server/' + serverId);
	} catch (error) {
		throw error;
	}
}

export async function getServerProfile(
	id: string,
	userId: string
): Promise<ServerProfile> {
	try {
		const res = await fetch(
			`${serverUrl}/servers/server-profile?serverId=${id}&userId=${userId}`,
			{
				method: 'GET',
				credentials: 'include',
				headers: await prepareHeaders(),
			}
		);
		const serverProfile = await res.json();
		return serverProfile.data;
	} catch (error) {
		throw error;
	}
}

export async function updateServerProfile(
	serverId: string,
	userId: string,
	username: string,
	avatar: string,
	avatarAssetId: string,
	bio: string
) {
	try {
		await fetch(`${serverUrl}/servers/update-server-profile`, {
			method: 'PATCH',
			credentials: 'include',
			headers: await prepareHeaders(),
			body: JSON.stringify({
				serverId,
				userId,
				username,
				avatar,
				avatarAssetId,
				bio,
			}),
		});
	} catch (error) {
		throw error;
	}
}

export async function deleteServer(serverId: string, currentSessionId: string) {
	try {
		await fetch(`${serverUrl}/servers/delete`, {
			method: 'DELETE',
			credentials: 'include',
			headers: await prepareHeaders(),
			body: JSON.stringify({
				serverId,
				currentSessionId,
			}),
		});
		revalidatePath('/server');
	} catch (error) {
		throw error;
	}
}

export async function isMemberOrAdmin(
	userId: string,
	serverId: string
): Promise<{
	isMember: boolean;
	isAuthor: boolean;
}> {
	try {
		const res = await fetch(
			`${serverUrl}/members/is-member-or-author?userId=${userId}&serverId=${serverId}`,
			{
				headers: await prepareHeaders(),
				method: 'GET',
				credentials: 'include',
			}
		);

		const member = await res.json();
		return member.data;
	} catch (error) {
		throw error;
	}
}
