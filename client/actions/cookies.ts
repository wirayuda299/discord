'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import { filterUUIDCookies } from '@/utils/uuidCookies';

export async function setCookie(key: string, value: string, path: string) {
	const currentCookies = cookies().getAll();

	const uuidCookies = filterUUIDCookies(currentCookies);

	if (uuidCookies.length >= 1) {
		uuidCookies.forEach((cookie) => {
			cookies().delete(cookie.name);
		});
	}
	cookies().set(key, value);
	revalidatePath(path);
}

export async function getCookies() {
	const currentCookies = cookies().getAll();

	const uuidCookies = filterUUIDCookies(currentCookies);
	return uuidCookies[0];
}
