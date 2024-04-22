import { Message } from "@/types/messages";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Socket } from "socket.io-client";

export default function useSocket(
  socket: Socket | null,
  params: Params,
  setChannelMessages: Dispatch<SetStateAction<Message[]>>,
) {
  useEffect(() => {
    if (!socket) return;

    socket?.emit("get-channel-message", {
      channelId: params.channel_id,
      serverId: params.id,
    });

    socket.on("set-message", (data) => {
      setChannelMessages(data);
    });
  }, [params.slug, socket]);
}
