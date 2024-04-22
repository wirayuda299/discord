"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";

import { cn } from "@/lib/utils";
import { useServerContext } from "@/providers/server";

import AddFriendSheet from "../add-friend-sheet";

const options = ["members", "media", "pins"] as const;

export default function ChanelInfo() {
  const [selectedOption, setSelectedOption] = useState<string>("members");
  const {
    serversState: { selectedChannel },
  } = useServerContext();
  if (!selectedChannel) return null;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button type="button">
          <ChevronRight className="text-gray-2" size={17} />
        </button>
      </DrawerTrigger>
      <DrawerContent className="border-t-2 border-none bg-black p-3 text-white">
        <DrawerTitle className="py-5 text-center ">
          #{selectedChannel.channel_name}
        </DrawerTitle>
        <ul className="flex items-center justify-evenly py-4">
          {options.map((option) => (
            <li
              onClick={() => setSelectedOption(option)}
              className={cn(
                "transition-all  duration-300 text-sm font-semibold capitalize",
                selectedOption === option &&
                  "text-primary border-b-2 border-b-primary",
              )}
              key={option}
            >
              {option}
            </li>
          ))}
        </ul>

        {selectedOption === "members" && (
          <div>
            <AddFriendSheet />

            <div className="pt-5">
              <p className="text-sm text-gray-2">Offline - 1</p>
              <div className="pt-3">
                <div className="w-full rounded-full bg-foreground px-3 py-1">
                  <div className="flex items-center gap-2">
                    <Image
                      src={"/icons/discord.svg"}
                      width={30}
                      height={30}
                      alt="user"
                    />
                    <h3 className="text-sm font-semibold">Username</h3>
                  </div>
                </div>
              </div>
              A
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
