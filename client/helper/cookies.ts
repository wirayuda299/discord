"use server";

import { cookies } from "next/headers";

export async function getCookies() {
  return await cookies().toString();
}

export async function prepareHeaders() {
  return {
		'content-type': 'application/json',
		Cookie: await getCookies(),
	};
}