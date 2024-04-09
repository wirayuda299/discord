'use server';

import { cookies } from 'next/headers';

import { filterUUIDCookies } from '@/utils/uuidCookies';

export async function setCookie(key: string, value: string) {
	const currentCookies = cookies().getAll();

	const uuidCookies = filterUUIDCookies(currentCookies);

	if (uuidCookies.length >= 1) {
		uuidCookies.forEach((cookie) => {
			cookies().delete(cookie.name);
		});
	}
	cookies().set(key, value);
}

export async function getCookies() {
	return await cookies().toString();
}
