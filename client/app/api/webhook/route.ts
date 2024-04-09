import { UserJSON, WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { clerkClient } from "@clerk/nextjs";

import { createUser } from "@/actions/user";
import { deleteUser } from "@/helper/user";

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
      if (id) {
        await clerkClient.users.deleteUser(id);
      }

      throw error;
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt?.data as unknown as UserJSON;
    const deletedUser = await deleteUser(id!);
    return NextResponse.json({ deletedUser }, { status: 200 });
  }

  return new Response("Success", { status: 201 });
}
