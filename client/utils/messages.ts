import type { Dispatch, SetStateAction } from "react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { ReadonlyURLSearchParams } from "next/dist/client/components/navigation.react-server";

import { Message } from "@/types/messages";
import { formUrlQuery } from "../lib/utils/form-url-query";
import { ServerStates } from "@/providers/server";



export const foundMessage = (messages: any[], msg: Message): Message => {
  return messages.find(
    (message) => message.message_id === msg.parent_message_id,
  );
};

export const handleSelectedMessage = (
  msg: Message,
  router: AppRouterInstance,
  searchParams: ReadonlyURLSearchParams,
  setServerStates: Dispatch<SetStateAction<ServerStates>>,
  type: string,
) => {
  router.push(formUrlQuery(searchParams.toString(), "type", type)!);
  setServerStates((prev) => ({
    ...prev,
    selectedMessage: msg,
  }));
};
