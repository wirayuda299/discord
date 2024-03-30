"use server";

import { ApiRequest } from "../utils/api";

const api = new ApiRequest();

export async function createUser(
  id: string,
  username: string,
  email: string,
  image: string,
) {
  try {
    await fetch("http://localhost:3001/api/v1/user/create", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id,
        username,
        email,
        image,
      }),
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteUser(id: string) {
  try {
    await fetch("http://localhost:3001/api/v1/user/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    });
  } catch (error) {
    throw error;
  }
}
