import { UserJSON, WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { deleteUser } from "@/helper/user";

const serverUrl = process.env.SERVER_URL;

export async function createUser(
  id: string,
  username: string,
  email: string,
  image: string,
) {
  try {
    await fetch(`${serverUrl}/user/create`, {
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
    console.log(error);

    throw error;
  }
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("WEBHOOK SECRET is required");
  }

  const headerPayload = headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent | undefined;

  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error verifying webhook:", err);
      return new Response("Error occured", {
        status: 400,
        statusText: err.message,
      });
    }
  }

  const eventType = evt?.type;

  if (eventType === "user.created") {
    const {
      id,
      email_addresses: email,
      username,
      image_url: image,
    } = evt?.data as UserJSON;

    try {
      const user = await createUser(
        id!,
        username!,
        email[0].email_address,
        image,
      );

      return NextResponse.json({ user }, { status: 201 });
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  if (eventType === "user.deleted") {
    try {
      const { id } = evt?.data as unknown as UserJSON;
      const deletedUser = await deleteUser(id!);
      return NextResponse.json({ deletedUser }, { status: 201 });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  if (eventType === "session.created") {
    // sign in or sign up
    console.log("Session created");

    return new Response("Session created", {
      status: 201,
      statusText: "Session created",
    });
  }
  if (eventType === "session.removed") {
    console.log("Session removed");
    return new Response("Session removed", {
      status: 201,
      statusText: "Session removed",
    });
  }
  if (eventType === "session.revoked") {
    console.log("Session revoked");
    return new Response("Session revoked", {
      status: 201,
      statusText: "Session revoked",
    });
  }

  return new Response("Success" + eventType, { status: 201 });
}
