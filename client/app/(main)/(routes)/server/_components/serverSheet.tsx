"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ServerChannel from "./server-channel";
import { Servers } from "@/types/server";
import { Channel } from "@/types/channels";
import { Menu } from "lucide-react";

export default function ServerSheet({
  server,
  channels,
}: {
  server: Servers | undefined;
  channels: {
    audio: Channel[];
    text: Channel[];
  };
}) {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className=" bg-[#2b2d31] p-2">
        <ServerChannel
          channels={channels}
          server={server}
          styles="min-w-full mt-4"
        />
      </SheetContent>
    </Sheet>
  );
}
