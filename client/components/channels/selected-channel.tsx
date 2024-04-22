"use client";

import { MoveLeft } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";

import { addLabelsToMessages } from "@/utils/messages";
import { cn } from "@/lib/utils";

import { useServerContext } from "@/providers/server";
import ChanelInfo from "../drawer/channel-info";
import Thread from "./threads";
import NotificationSettings from "./notification-settings";
import PinnedMessage from "../messages/pinned-message";
import Inbox from "./inbox";
import MemberSheet from "./members";
import ChatForm from "../messages/chat-form";
import ChatItem from "../messages/chat-item";

import { useSocketContext } from "@/providers/socket-io";
import useSwipe from "@/hooks/useSwipe";
import useSocket from "@/hooks/useSocket";
import SearchForm from "./search-form";
import useScroll from "@/hooks/useScroll";

export default function SelectedChannel() {
  const params = useParams();
  const { userId } = useAuth();
  const ref = useRef<HTMLUListElement>(null)
  const { serversState, setServerStates } = useServerContext();
  const [value] = useState<string>("");
  const { channelMessages, socket, setChannelMessages } = useSocketContext();
  const { onTouchEnd, onTouchMove, onTouchStart } = useSwipe(setServerStates);
  useSocket(socket, params, setChannelMessages);
  useScroll(ref, channelMessages);

  useEffect(() => {
    setServerStates((prev) => ({
      ...prev,
      selectedMessage: null,
      selectedThread: null,
    }));
  }, [serversState.selectedChannel, setServerStates]);

  const messageList = useMemo(
    () => addLabelsToMessages(channelMessages),
    [channelMessages],
  );

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className={cn(
        "fixed md:static transition-all ease-out duration-300 top-0 md:z-0 z-40 h-screen overflow-y-auto overflow-x-hidden bg-black md:bg-background border-l-2 border-l-foreground w-full",
        serversState.selectedChannel ? "right-0" : "-right-full",
      )}
    >
      <header className="flex min-h-14 w-full items-center justify-between border-b-2 border-b-foreground p-2 ">
        <div className="flex items-center gap-3">
          <Link
            href={"/server/" + params.id}
            className="md:hidden"
            onClick={() => {
              setServerStates((prev) => ({
                ...prev,
                selectedChannel: null,
              }));
            }}
          >
            <MoveLeft className="text-gray-2" />
          </Link>
          <div className="flex items-center gap-1 ">
            <h3 className="text-md flex items-center gap-2 font-medium lowercase text-white">
              <Image
                src={"/icons/hashtag.svg"}
                width={24}
                height={24}
                alt={"hashtag"}
                key={"hashtag"}
              />
              {serversState.selectedChannel?.channel_name}
            </h3>
            <div className="md:hidden">
              <ChanelInfo />
            </div>
          </div>
        </div>
        <div className="hidden items-center gap-4 min-[837px]:flex">
          <Thread
            channelId={params.channel_id as string}
            serverId={params.id as string}
          />
          <NotificationSettings />
          <PinnedMessage channelId={params.id as string}/>
          <MemberSheet selectedServer={serversState.selectedServer} />
         <SearchForm/>
          <Inbox />
          <Image
            src={"/icons/ask.svg"}
            width={24}
            height={24}
            alt={"ask"}
            key={"ask"}
          />
        </div>
      </header>
      <div className="flex h-[calc(100vh-120px)] max-w-full flex-col">
        <ul className="ease flex min-h-full flex-col gap-5 overflow-y-auto p-2 transition-all duration-500 md:p-5" ref={ref}>
          {messageList.length >= 1 &&
            messageList?.map((msg) => (
              <ChatItem
                socket={socket}
                serverStates={serversState}
                messages={channelMessages}
                setServerStates={setServerStates}
                userId={userId!!}
                msg={msg}
                key={msg.message_id}
              />
            ))}
        </ul>

        <ChatForm
          value={value}
          serverStates={serversState}
          setServerStates={setServerStates}
        />
      </div>
    </div>
  );
}
