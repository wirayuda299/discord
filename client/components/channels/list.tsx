"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Plus } from "lucide-react";

import { Channel } from "@/types/channels";
import { Servers } from "@/types/server";

import { cn } from "@/lib/utils";
import { useServerContext } from "@/providers/server";

import CreateChannelModals from "../modals/create-channel";
import AddUserDrawer from "../drawer/add-user";

export default function ChannelList({
  channels,
  server,
}: {
  channels: Channel[];
  server: Servers | null | undefined;
}) {
  const { userId } = useAuth();
  const {
    serversState: { selectedChannel },
    setServerStates,
  } = useServerContext();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const params = useParams();

  const groupedChannels = useMemo(() => {
    const grouped = channels?.reduce((acc: Channel[], channel) => {
      const category = acc.find((c) => c.channel_type === channel.channel_type);
      if (category) {
        category.channels.push(channel);
      } else {
        acc.push({
          category_id: channel.category_id,
          category_name: channel.category_name,
          channels: [channel],
          channel_id: channel.channel_id,
          channel_name: channel.channel_name,
          channel_type: channel.channel_type,
        });
      }
      return acc;
    }, []);

    return grouped?.sort((a, b) => {
      if (a.channel_type === "text" && b.channel_type !== "text") {
        return -1;
      } else if (a.channel_type !== "text" && b.channel_type === "text") {
        return 1;
      } else {
        return 0;
      }
    });
  }, [channels]);

  useEffect(() => {
    const channel = channels.find((c) => c.channel_id === params.channel_id);
    setServerStates((prev) => ({
      ...prev,
      selectedChannel: channel || null,
    }));
  }, [params.channel_id]);

  return (
    <div className="text-gray-2">
      {groupedChannels?.map((channel) => (
        <div className="my-4" key={channel?.category_id}>
          <div className="flex w-full items-center justify-between pr-2">
            <div
              onClick={() =>
                setSelectedCategory((prev) =>
                  prev === channel?.category_name ? "" : channel?.category_name,
                )
              }
              className="flex cursor-pointer items-center gap-1 "
            >
              <ChevronRight
                size={18}
                className={cn(
                  "transition-all ease duration-300",
                  selectedCategory === channel?.category_name && "rotate-90",
                )}
              />
              <h3 className="text-xs font-semibold uppercase">
                {channel?.category_name} channel
              </h3>
            </div>
            <CreateChannelModals
              serverId={server?.id!}
              type={channel?.channel_type}
            >
              <button>
                <Plus size={18} />
              </button>
            </CreateChannelModals>
          </div>
          <ul
            className={cn(
              "h-0 flex flex-col gap-1",
              selectedCategory === channel?.category_name ||
                selectedChannel?.channel_id === channel.channel_id
                ? "h-auto overflow-auto [&>*:nth-child(1)]:mt-2 transition-all ease duration-300"
                : "overflow-hidden",
            )}
          >
            {channel?.channels?.map((c) => (
              <Link
                role="listitem"
                scroll
                prefetch
                href={`/server/${server?.id}/${c.channel_id}?channel_type=${c.channel_type}`}
                key={c?.channel_id}
                onClick={() => {
                  setServerStates((prev) => ({
                    ...prev,
                    selectedChannel: c,
                  }));
                }}
                className={cn(
                  "hover:bg-background/80 group ml-2 h-max cursor-pointer rounded-lg px-3 py-1 text-sm",
                  c.channel_id === selectedChannel?.channel_id &&
                    "bg-background/80",
                )}
              >
                <div className="flex h-max items-center justify-between">
                  <div className="flex items-center gap-1">
                    {c?.channel_type === "audio" && (
                      <Image
                        src={"/icons/volume.svg"}
                        width={18}
                        height={18}
                        alt="volume icon"
                      />
                    )}
                    <div className="flex items-center gap-1">
                      {c.channel_type !== "audio" && (
                        <Image
                          src={"/icons/hashtag.svg"}
                          width={24}
                          height={24}
                          alt={"hashtag"}
                          key={"hashtag"}
                        />
                      )}
                      <span>{c?.channel_name}</span>
                    </div>
                  </div>
                  {userId === server?.owner_id && (
                    <button className="opacity-0 group-hover:opacity-100">
                      <AddUserDrawer />
                    </button>
                  )}
                </div>
              </Link>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
