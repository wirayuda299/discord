"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { status } from "@/constants/status";

export default function FriendHeader() {
  const params = useParams();
  const [selectedStatus, setSelectedStatus] =
    useState<(typeof status)[number]>("online");

  if (!params?.slug?.includes("friends")) return null;

  return (
    <header className="hidden w-full items-center gap-5 overflow-x-auto p-3 md:flex">
      <div className="flex items-center gap-2">
        <Image src={"/icons/friend.svg"} width={25} height={25} alt="friend" />
        <h2 className="text-base font-semibold text-gray-2">Friends</h2>
      </div>
      <ul className="flex items-center gap-2 lg:gap-3">
        {status.map((status) => (
          <li
            onClick={() => setSelectedStatus(status)}
            key={status}
            className={cn(
              "text-gray-2 ease min-w-max hover:bg-background cursor-pointer rounded-md px-3 py-0.5 text-sm font-medium capitalize hover:brightness-150 transition-colors duration-300 hover:text-white",
              status === selectedStatus ? "bg-background brightness-150" : "",
            )}
          >
            {status}
          </li>
        ))}
        <button className="min-w-max truncate rounded-md bg-green-1 px-3 py-1 text-xs font-semibold text-white">
          Add friend
        </button>
      </ul>
    </header>
  );
}
