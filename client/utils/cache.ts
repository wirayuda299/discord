'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

export async function revalidate(path: string) {
  revalidatePath(path);
}

export async function revalidateTags(tag: string) {
  revalidateTag(tag);
}
