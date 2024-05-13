import { useCallback, useEffect, useReducer } from "react";
import { socketReducer } from "@/reducer/socket";
import { useParams, useSearchParams } from "next/navigation";

import { useSocketContext } from "@/providers/socket-io";
import { Message } from "@/types/messages";

const intialValues = {
  active_users: [] as string[],
  channel_messages: [] as Message[],
  personal_messages: [] as Message[],
  thread_messages: [] as Message[],
};

export default function useSocket() {
  const { socket } = useSocketContext();
  const params = useParams();
  const searchParams = useSearchParams();
  const [states, dispatch] = useReducer(socketReducer, intialValues);

  const reloadChannelMessage = useCallback(
    (channelId: string, serverId: string) => {
      if (socket) {
        socket?.emit("get-channel-message", {
          channelId,
          serverId,
        });
      }
    },
    [socket],
  );

  const reloadPersonalMessage = () => {
    socket?.emit("personal-message", {
      userId: searchParams.get("chat"),
      conversationId: searchParams.get("conversationId"),
    });
  };

  const reloadThreadMessages = 
    (threadId: string) => {
      if (socket) {
        socket.emit("thread-messages", {
          threadId,
          serverId: params.id as string,
          channelId:params.channel_id
        });
      }
    }

  useEffect(() => {
    if (!socket) return;

    if (searchParams.get("chat")) {
      reloadPersonalMessage();
      socket.on("set-personal-messages", (messages) => {
        dispatch({ type: "PERSONAL_MESSAGES", payload: messages });
      });
    }

    if (params.channel_id && params.id) {
      reloadChannelMessage(params.channel_id as string, params.id as string);

      socket.on("set-message", (data) => {
        dispatch({ type: "CHANNEL_MESSAGES", payload: data });
      });
    }

    socket.on("set-active-users", (data) => {
      dispatch({ type: "ACTIVE_USERS", payload: data });
    });

    socket.on("set-thread-messages", (data) => {
      dispatch({ type: "THREAD_MESSAGES", payload: data });
    });
  }, [socket, searchParams, params]);

  return {
    reloadChannelMessage,
    states,
    dispatch,
    reloadPersonalMessage,
    reloadThreadMessages,
    searchParams,
    socket,
  };
}
