'use server';

import { cookies } from 'next/headers';

import { filterUUIDCookies } from '@/utils/uuidCookies';

export async function getCookies() {
  const currentCookies = cookies().getAll();

  const uuidCookies = filterUUIDCookies(currentCookies);
  return uuidCookies[0];
}
