"use server";

import { cookies } from "next/headers";


export async function getCookies() {
  return await cookies().toString();
}
