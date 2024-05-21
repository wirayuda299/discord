"use server";

import { ApiRequest } from "@/utils/api";

const api = new ApiRequest();

type Props = {
  msgId: string;
  userId: string;
  imageUrl: string;
  imageAssetId: string;
  message: string;
  channelId: string;
  threadName: string;
};

export async function createThread(props: Props) {
  try {
    const {
      channelId,
      imageAssetId,
      imageUrl = "",
      message = "",
      msgId,
      threadName,
      userId,
    } = props;
     await api.post("/threads/create", {
      imageAssetId,
      message,
      image: imageUrl,
      name: threadName,
      userId,
      messageId: msgId,
      channelId,
     });
  } catch (error) {
    throw error;
  }
}

type ReplyProps = {
  messageId: string;
  content: string;
  userId: string;
  imageUrl: string;
  imageAssetId: string;
  threadId: string;
};

export async function replyThread(props: ReplyProps) {
  try {
    const {
      content,
      imageAssetId = "",
      imageUrl = "",
      messageId,
      userId,
      threadId,
    } = props;
    await api.post("/threads/reply", {
      messageId,
      threadId,
      content,
      userId,
      imageUrl,
      imageAssetId,
    });
  } catch (error) {
    throw error;
  }
}
