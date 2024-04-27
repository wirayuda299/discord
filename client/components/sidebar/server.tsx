"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";

import ChannelList from "../channels/list";
import { cn } from "@/lib/utils";
import { Servers } from "@/types/server";
import ServerMenu from "../channels/server-menus";
import ChannelDrawerMobile from "../drawer/ChannelMobile";
import { Channel } from "@/types/channels";

export default function ServerSidebar({
  data,
}: {
  data: {
    server: Servers;
    channels: Channel[];
  };
}) {
  const { user, isLoaded, isSignedIn } = useUser();

  return (
    <ul
      className={cn(
        "min-w-[255px] md:min-w-[250px] relative flex-col gap-3 border-r-2 border-r-foreground justify-between no-scrollbar  md:bg-[#2b2d31] h-full md:h-full min-h-screen overflow-y-auto ",
        data.server && "flex",
      )}
    >
      <div className="size-full p-1">
        {data.server && (
          <ServerMenu serverName={data.server.name} serverId={data.server.id} />
        )}

        <ChannelDrawerMobile
          channels={data?.channels ?? []}
          server={data?.server!}
        />

        <ChannelList channels={data?.channels ?? []} server={data.server} />
      </div>
      <div
        className={cn(
          "sticky !bottom-0 left-0 min-h-16 flex items-center w-full bg-[#232428] px-3 text-white",
          (!isLoaded || !isSignedIn) && "animate-pulse",
        )}
      >
        {isLoaded && isSignedIn && (
          <div className="flex items-center gap-3">
            <Image
              src={user?.imageUrl}
              width={40}
              className="aspect-auto min-h-10 min-w-10 rounded-full  object-cover "
              height={40}
              alt="user"
            />
            <div>
              <h3 className="text-sm capitalize">{user?.username}</h3>
              <p className="text-xs text-gray-2">invisible</p>
            </div>
          </div>
        )}
      </div>
    </ul>
  );
}
