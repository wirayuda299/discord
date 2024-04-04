'use server';

import { ApiRequest } from '@/utils/api';

interface UserInvite {
	user_to_invite: string;
	invitator: string;
	status: string;
	id: string;
	username: string;
	email: string;
	image: string;
	created_at: string;
	updated_at: string;
}
const api = new ApiRequest();

export async function getPendingInvitation() {
	try {
		return await api.get<UserInvite[]>(
			`/invitation/pending-invitation?userId=${api.getUserId}`
		);
	} catch (error) {
		throw error;
	}
}

export async function getMyInvitation() {
	try {
		return await api.get<UserInvite[]>(
			`/invitation/my-invitation?userId=${api.getUserId}`
		);
	} catch (error) {
		throw error;
	}
}

export async function acceptinvitation(friendId: string) {
	try {
		await api.post('/invitation/accept', { userId: api.getUserId, friendId });
	} catch (error) {
		throw error;
	}
}
